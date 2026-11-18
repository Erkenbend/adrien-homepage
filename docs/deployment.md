# Deployment

`bun run build` writes a static site to `dist/`. In production it is served from AWS. The infrastructure is defined with the AWS CDK in [infrastructure/](../infrastructure) and deployed by GitHub Actions.

## Infrastructure

There is one stack, `AdrienHomepageInfrastructureStack`, in `us-east-1` (CloudFront only accepts certificates from there):

- **S3 bucket:** holds a copy of `dist/`, uploaded on every deployment and served without caching.
- **CloudFront distribution:** reads the bucket through Origin Access Control and answers 403/404 with `index.html`, so that `/en/` and `/fr/` work.
- **Certificate:** a DNS-validated ACM certificate for the subdomain only.
- **DNS:** a Route 53 A record pointing the subdomain at the distribution, in a hosted zone that already exists (imported by its id).

The CDK commands are listed in [infrastructure/README.md](../infrastructure/README.md). `bunx cdk synth` works without AWS access and is a quick check of the stack.

## GitHub Actions

Every push to `main` runs [the workflow](../.github/workflows/github-actions-build-deploy.yml): install → lint → build → `cdk diff` → `cdk deploy`.

The repository needs the secrets `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` for a user allowed to deploy the stack.

## Manual deployment

With local AWS credentials:

```sh
bun run build
cd infrastructure
bun install
bunx cdk diff
bunx cdk deploy AdrienHomepageInfrastructureStack
```

## Deploying your own copy

1. **Domain:** a domain with a public hosted zone in Route 53.
2. **CDK bootstrap:** bootstrap the AWS account once in `us-east-1`: `bunx cdk bootstrap` in `infrastructure/`.
3. **Constants:** in `infrastructure/lib/infrastructure-stack.ts`, set
   - `ROOT_DOMAIN_NAME` and `ROOT_HOSTED_ZONE_ID`: your domain and the id of its hosted zone;
   - `SUBDOMAIN`: the page is served at `<SUBDOMAIN>.<ROOT_DOMAIN_NAME>`;
   - `bucketName`: bucket names are unique across all AWS accounts, so pick your own.
4. **Names (optional):** rename the stack in `infrastructure/bin/infrastructure.ts`, and use the same name in the workflow and in the manual commands above. The construct ids (`AdrienHomepage…`) can stay as they are.
5. **CI:** add the two secrets to your repository.

To serve the page at the root domain instead of a subdomain, change the certificate's `domainName` and the A record's `recordName` to the root domain.

## Other hosts

`dist/` works on any static host (GitHub Pages, Netlify, nginx, …) as long as the host serves `index.html` for paths without a file, at least for `/en/` and `/fr/`. Examples: `try_files $uri /index.html;` in nginx, a `/* /index.html 200` rule in Netlify's `_redirects`. On GitHub Pages, a copy of `index.html` as `404.html` does the job.
