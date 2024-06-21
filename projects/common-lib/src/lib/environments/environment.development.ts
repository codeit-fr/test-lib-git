import { envBase } from "./environment.base";

export const environmentDevelopment = {
  ...envBase,
  stage: 'dev',
  live: true,
  production: false
};
