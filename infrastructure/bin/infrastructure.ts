#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const app = new cdk.App();
new InfrastructureStack(app, 'AdrienHomepageInfrastructureStack', {
    // CloudFront only accepts certificates from us-east-1
    env: { region: 'us-east-1' },
});
