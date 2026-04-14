# Driven
This is a monorepo that holds all things related to the Driven app (API, web UI, mobile, etc)

## Main technologies used
- [Nx](https://nx.dev/) for monorepo managment and build caching
- [NodeJS](https://nodejs.org) as the runtime for the API and local build tools
- [Typescript](https://www.typescriptlang.org/) everywhere, for type safety and general code confidence
- [SST](https://docs.sst.dev/what-is-sst): to manage infrastructure and API routes
- [NextJS](https://nextjs.org/) (which is based on React) as the UI framework of choice

## Getting started
It is recomended to use [VS Code](https://code.visualstudio.com/) as your editor along with the [Nx Console extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console). This will make running commands and tasks related to the monorepo much easier.

### Prerequisites
- [NodeJS](https://nodejs.org) (v18.17.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [git](https://git-scm.com/) (any version really)

### Installation and running locally
1. Clone the repo
1. Run `npm install` from the root directory to install all dependencies
1. Run `npm run dev` to start both the API and UI in development mode
    - alternativly, you can run `npm run dev:ui` or `npm run dev:api` to only start one of them
1. You can now open your browser to http://localhost:4200 to see the UI or http://localhost:3333/api to see the API

## Directory structure explained
For detials, you can check out [the Nx documentation](https://nx.dev/concepts/more-concepts/folder-structure), but here is a quick explination:
- `.github`: Contains all github related files (workflows, issue templates, etc)
- `apps`: Contains all "applications" such as the API, UI, mobile, etc. Each "app" will also have its own README file with details specific to that app.
- `libs`: Contains all shared code that can be used by any of the apps (such as shared types, utils, etc)
- `infrastucture`: Contains all infrastructure-as-code items, 
- `nx.json`: The main [configuration file for Nx](https://nx.dev/concepts/types-of-configuration)