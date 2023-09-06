# REST API
As the name implies, REST API that power the Driven app

## Core technologies
- [NodeJS](https://nodejs.org) as the runtime for the API and local build tools
- [Typescript](https://www.typescriptlang.org/) everywhere, for type safety and general code confidence
- [Serverless framework](https://www.serverless.com/) + [Serverless Compose](https://www.serverless.com/blog/serverless-framework-compose-multi-service-deployments) to manage infrastructure and API 

## Directory structure explained
- `src`: Contains all the source code for the API
- `src/apps`: Each subdirectory in here represents an individual "service" that makes up the API. You can think of a "service" as logical grouping of business logic, which manages its own API endpoints, data sources, etc. Each one is able to be deployed independently of the others and they will each have their own `serverless.ts` file.
- `src/serverless.base.ts`: the shared base configuration for all services (except for the "BaseApiGateway" service)
- `serverless-compose.yml`: Configuartion file for Serverless Compose

## How to test/run locally
TBD

## How to create a new service
TBD

## How to deploy
TBD