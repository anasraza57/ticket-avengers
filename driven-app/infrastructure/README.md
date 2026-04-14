# Infrastructure

This directory holds constructs for both [SST](https://sst.dev/chapters/what-is-sst.html) and [AWS CDK](https://sst.dev/chapters/what-is-aws-cdk.html) that set up and manage all things infrastructure-related that do not require application-specific definitions or configurations. In other words, this is the code that controls the actual AWS infrastructure.


## Infrastructure as code

All infrastructure-related items are managed using a technique or principle called [infrastructure as code](https://searchitoperations.techtarget.com/definition/Infrastructure-as-Code-IAC) - this means that there are a bunch of configuration files that describe infrastructure resources and how they are set up and how they relate to each other. At no point should you nor anyone else log in to AWS and create stuff via the web console (unless it's for a quick test). We live in the future, [Homey don't play that](https://youtu.be/YxYvzVxJtYM)

There are several benefits to managing all infrastructure via configuration files and NOT through the web console:

1. History: everything is code/configuration, so it can all be saved in a source control system. That means keeping track of what AWS config changed when and how to roll it back is as simple as looking at a file's git history.
2. Predictability and repeatability: because everything is captured in code/configuration files, spinning up new, identical environments is straightforward.
3. Speed: rolling out an infrastructure change to multiple environments or multiple resources is just a matter of updating a handful of files. No more logging into two or three accounts, jumping through 10 menus, and then trying to remember what you clicked.


## Shared infrastructure/resoureces expaliend

### Base API Gateway (api-gateway.ts)
This stack defines the shared API gateway that all other services use. It uses [the `Api` construct from SST](https://docs.sst.dev/constructs/Api) and defines things such as CORS, authentication, and other things that are shared across all services.

One thing that may look odd is that there are no API routes defined. Each of those are managed by the individual services. This is done so that each service can manage its own routes and it helps keep things organized. Check out [the API app README](../apps/api/README.md) for details about that.

### API Authorizer (api-authorizer.ts)
This is not a stack nor infra definition like all the others. Instead, this is code behind our [custom Lambda authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html) which is used in conjuection with the API gateway. 

### Cognito (cognito.ts)
This stack defines the Cognito user pool and all things related to that.