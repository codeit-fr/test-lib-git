// WARNING, do not touch the double quote (") chars used in version, commitHash, and installationDate, as it's used by the CI/CD
export const envBase = {
  version: "0.1.0.0",
  commitHash: "",
  packageGenerationDate: "",
  stage: '',
  live: false,
  production: false,

  firebase: {
    projectId: 'demo-time-it',
    host: '127.0.0.1:8080',
    firestoreHost: '127.0.0.1:8080',
    ssl: false,
    apiKey: "any-string-value",
    authDomain: 'demo-time-it.any.com',
  }
};
