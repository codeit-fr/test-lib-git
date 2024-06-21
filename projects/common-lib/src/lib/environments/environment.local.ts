import { envBase } from "./environment.base";

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


// WARNING, do not touch the double quote (") chars used in version, commitHash, and installationDate, it used by the CI/CD
export const environmentLocal = {
  ...envBase,

  stage: 'local',
  live: false,
  production: false,
};
