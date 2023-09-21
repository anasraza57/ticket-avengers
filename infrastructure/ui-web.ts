import { StaticSite, StackContext } from 'sst/constructs';

import CloudFrontOrigin from 'aws-cdk-lib/aws-cloudfront-origins'
import CloudFront from 'aws-cdk-lib/aws-cloudfront'
import * as CDK from 'aws-cdk-lib'

export function WebUi({ stack }: StackContext) {

  const domain = CDK.Fn.parseDomainName( CDK.Fn.importValue('RestApiUrl'))

  const site = new StaticSite(stack, 'WebUi', {
    // path: 'apps/ui-web/dist',
    buildCommand: 'nx build ui-web',
    buildOutput: 'dist/apps/ui-web/.next',
    purgeFiles: true,
    waitForInvalidation: true,
    indexPage: 'index.html',
    cdk: {
        distribution: {
            additionalBehaviors: {
                '/api/*': {
                    origin: new CloudFrontOrigin.HttpOrigin(domain),
                    allowedMethods: CloudFront.AllowedMethods.ALLOW_ALL,
                    viewerProtocolPolicy: CloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
                }
            }
        }
    }
  })
}