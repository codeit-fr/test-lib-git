import { envBase } from "./environment.base";

export const environmentStaging = {
  ...envBase,

  stage: 'uat',
  live: true,
  production: false,
  firebase: {
    projectId: 'time-it-uat',
    storageBucket: '',
    apiKey: 'AIzaSyBBcvi1dgnMbVUU0nSS5RbztZ24CYAhIho',
    authDomain: 'time-it-uat.firebaseapp.com',
    messagingSenderId: '291494207232'
  }
};
