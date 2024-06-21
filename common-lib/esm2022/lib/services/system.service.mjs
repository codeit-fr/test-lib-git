import { Injectable } from '@angular/core';
import { firstValueFrom } from "rxjs";
import { environmentDevelopment } from "../environments/environment.development";
import { environmentProduction } from "../environments/environment.production";
import { environmentStaging } from "../environments/environment.staging";
import { environmentLocal } from "../environments/environment.local";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class SystemService {
    constructor(http) {
        this.http = http;
    }
    async getEnvironmentConfiguration() {
        const env = await firstValueFrom(this.http.get('/assets/config.json'));
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: SystemService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: SystemService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: SystemService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21tb24tbGliL3NyYy9saWIvc2VydmljZXMvc3lzdGVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQW1CLGNBQWMsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUVuRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNqRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7O0FBY3JFLE1BQU0sT0FBTyxhQUFhO0lBR3hCLFlBQTJCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFDM0MsQ0FBQztJQUdELEtBQUssQ0FBQywyQkFBMkI7UUFDL0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQWUscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFFeEIsUUFBUSxLQUFLLEVBQUUsQ0FBQztZQUNkLEtBQUssS0FBSztnQkFDUixPQUFPLHNCQUFzQixDQUFDO1lBQ2hDLEtBQUssTUFBTTtnQkFDVCxPQUFPLHFCQUFxQixDQUFDO1lBQy9CLEtBQUssS0FBSztnQkFDUixPQUFPLGtCQUFrQixDQUFDO1lBQzVCO2dCQUNFLE9BQU8sZ0JBQWdCLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7OEdBckJVLGFBQWE7a0hBQWIsYUFBYSxjQUZaLE1BQU07OzJGQUVQLGFBQWE7a0JBSHpCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGZpcnN0VmFsdWVGcm9tLCBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudERldmVsb3BtZW50IH0gZnJvbSBcIi4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5kZXZlbG9wbWVudFwiO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudFByb2R1Y3Rpb24gfSBmcm9tIFwiLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50LnByb2R1Y3Rpb25cIjtcclxuaW1wb3J0IHsgZW52aXJvbm1lbnRTdGFnaW5nIH0gZnJvbSBcIi4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5zdGFnaW5nXCI7XHJcbmltcG9ydCB7IGVudmlyb25tZW50TG9jYWwgfSBmcm9tIFwiLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50LmxvY2FsXCI7XHJcblxyXG5pbnRlcmZhY2UgQ29uZmlnU3lzdGVtIHtcclxuICBzdGFnZTogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29uZmlndXJhdGlvbiB7XHJcbiAgc3RhZ2U6IHN0cmluZztcclxuICBmaXJlYmFzZToge31cclxufVxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU3lzdGVtU2VydmljZSB7XHJcblxyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgfVxyXG5cclxuXHJcbiAgYXN5bmMgZ2V0RW52aXJvbm1lbnRDb25maWd1cmF0aW9uKCk6IFByb21pc2U8Q29uZmlndXJhdGlvbj4ge1xyXG4gICAgY29uc3QgZW52ID0gYXdhaXQgZmlyc3RWYWx1ZUZyb20odGhpcy5odHRwLmdldDxDb25maWdTeXN0ZW0+KCcvYXNzZXRzL2NvbmZpZy5qc29uJykpO1xyXG4gICAgY29uc3Qgc3RhZ2UgPSBlbnYuc3RhZ2U7XHJcblxyXG4gICAgc3dpdGNoIChzdGFnZSkge1xyXG4gICAgICBjYXNlICdkZXYnOlxyXG4gICAgICAgIHJldHVybiBlbnZpcm9ubWVudERldmVsb3BtZW50O1xyXG4gICAgICBjYXNlICdwcm9kJzpcclxuICAgICAgICByZXR1cm4gZW52aXJvbm1lbnRQcm9kdWN0aW9uO1xyXG4gICAgICBjYXNlICd1YXQnOlxyXG4gICAgICAgIHJldHVybiBlbnZpcm9ubWVudFN0YWdpbmc7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGVudmlyb25tZW50TG9jYWw7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==