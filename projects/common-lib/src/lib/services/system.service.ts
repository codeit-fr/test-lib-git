import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environmentDevelopment } from "../environments/environment.development";
import { environmentProduction } from "../environments/environment.production";
import { environmentStaging } from "../environments/environment.staging";
import { environmentLocal } from "../environments/environment.local";

interface ConfigSystem {
  stage: string;
}

interface Configuration {
  stage: string;
  firebase: {}
}

@Injectable({
  providedIn: 'root'
})
export class SystemService {


  public constructor(private http: HttpClient) {
  }


  async getEnvironmentConfiguration(): Promise<Configuration> {
    const env = await firstValueFrom(this.http.get<ConfigSystem>('/assets/config.json'));
    const stage = env.stage;

    switch (stage) {
      case 'dev':
        return environmentDevelopment;
      case 'prod':
        return environmentProduction;
      case 'uat':
        return environmentStaging;
      default:
        return environmentLocal;
    }
  }
}
