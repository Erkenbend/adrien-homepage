import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import {Construct} from 'constructs';

// Hosted zone created together with the domain
const ROOT_DOMAIN_NAME = 'wehrung.online';
const ROOT_HOSTED_ZONE_ID = 'Z0438866UI516D0PAKH6';

// Project-specific constants
const SUBDOMAIN = 'adrien';
const DOMAIN_NAME = SUBDOMAIN + '.' + ROOT_DOMAIN_NAME;
const BUILD_DIR = '../dist';

export class InfrastructureStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // DOMAIN SPECIFIC

        // Import the hosted zone that was created when buying the domain name
        const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'RootHostedZone', {
            hostedZoneId: ROOT_HOSTED_ZONE_ID,
            zoneName: ROOT_DOMAIN_NAME
        })

        // Certificate for this subdomain only
        const certificate = new acm.Certificate(this, 'AdrienHomepageCert', {
            domainName: DOMAIN_NAME,
            validation: acm.CertificateValidation.fromDns(hostedZone)
        });

        // FOR THIS APPLICATION

        // This will store a copy of the build directory
        const bucket = new s3.Bucket(this, 'AdrienHomepageBucket', {
            bucketName: 'adrien-homepage-bucket-919713414705-us-east-1',  // Should be unique across all zones and accounts
            versioned: true,
        });

        // Sync the build directory contents with the S3 bucket
        new s3deploy.BucketDeployment(this, 'DeployAdrienHomepageApplication', {
            sources: [s3deploy.Source.asset(BUILD_DIR)],
            destinationBucket: bucket,
            cacheControl: [s3deploy.CacheControl.fromString('max-age=0,no-cache,no-store,must-revalidate')]
        });

        // Maps page paths to the prerendered index.html of their language, e.g. /en/ to /en/index.html
        const pagePath = new cloudfront.Function(this, 'AdrienHomepagePagePath', {
            code: cloudfront.FunctionCode.fromFile({filePath: path.join(__dirname, 'page-path.js')}),
            runtime: cloudfront.FunctionRuntime.JS_2_0,
        });

        // Create Cloudfront distribution with custom domain and redirects
        const distribution = new cloudfront.Distribution(this, 'AdrienHomepageDistribution', {
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(
                    bucket,
                    {originAccessLevels: [cloudfront.AccessLevel.READ]}
                ),
                functionAssociations: [{function: pagePath, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST}],
            },
            defaultRootObject: "index.html",
            domainNames: [DOMAIN_NAME],
            certificate: certificate,
            errorResponses: [
                redirectToIndexOnError(403),
                redirectToIndexOnError(404),
            ],
        });

        // This A-record allows the Cloudfront distribution to be found under its custom domain
        new route53.ARecord(this, 'AdrienHomepageRecord', {
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            recordName: DOMAIN_NAME
        });
    }
}

function redirectToIndexOnError(httpStatus: number): cdk.aws_cloudfront.ErrorResponse {
    return {
        httpStatus: httpStatus,
        responsePagePath: '/index.html',
        responseHttpStatus: 200,
        ttl: cdk.Duration.minutes(0),
    }
}
