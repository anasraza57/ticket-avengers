import { SSTConfig } from "sst"
import { API } from "./infrastructure/api-gateway"
import { UserTable, UserApiRoutes } from "./apps/api/src/services/User/infrastructure"
import { AuthCognito } from './infrastructure/cognito'
import { WebUi }  from './infrastructure/ui-web'
import { GitHubOpenId } from './infrastructure/github-aws-openid'

const environmentsToKeep = ["qa", "prod"];

export default {
  config(_input) {
    return {
      name: "driven-app",
      region: "us-east-1",
      advanced: {
        disableParameterizedStackNameCheck: true
      }
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      architecture: "arm_64",
      logRetention: "one_week",
      timeout: 30,
    })

    if (! environmentsToKeep.includes(app.stage)) {
        app.setDefaultRemovalPolicy("destroy")
    }
    app
      .stack(GitHubOpenId)
      .stack(AuthCognito)

      // all tables should be intialized before the API
      .stack(UserTable)
      
      // API and all API routes (which are lazy-loaded)
      .stack(API)
      .stack(UserApiRoutes)

      // and leave the UI for last
      .stack(WebUi)
        
  }
} satisfies SSTConfig;


