import { envBase } from "./environment.base";

export const environmentProduction = {
  ...envBase,
  stage: 'prod',
  live: true,
  production: true,
  firebase: {
    apiKey: "AIzaSyDj_7nBw_VjvAmv4ClGbSYICBF26c2CgNM",
    authDomain: "time-it-prod.firebaseapp.com",
    projectId: "time-it-prod",
    storageBucket: "time-it-prod.appspot.com",
    messagingSenderId: "876939417541",
    appId: "1:876939417541:web:216f796184014f42d3ddac"
  }
};
