import { Injectable } from '@angular/core';
import { connectFirestoreEmulator, initializeFirestore } from "firebase/firestore";
import * as i0 from "@angular/core";
import * as i1 from "./system.service";
export class FirestoreService {
    constructor(systemService) {
        this.systemService = systemService;
        // the port used when emulating Firestore service (only in local environment)
        this.firestoreEmulatorPort = 8080;
    }
    async init(app) {
        // Initialize Cloud Firestore and get a reference to the service
        const configuration = await this.systemService.getEnvironmentConfiguration();
        this.db = initializeFirestore(app, {
            experimentalAutoDetectLongPolling: true
        });
        // in Local, we use Firestore emulator
        if (configuration.stage === 'local') {
            connectFirestoreEmulator(this.db, 'localhost', this.firestoreEmulatorPort);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: FirestoreService, deps: [{ token: i1.SystemService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: FirestoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: FirestoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.SystemService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21tb24tbGliL3NyYy9saWIvc2VydmljZXMvZmlyZXN0b3JlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQWEsd0JBQXdCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7O0FBTTlGLE1BQU0sT0FBTyxnQkFBZ0I7SUFRM0IsWUFBMkIsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFOdkQsNkVBQTZFO1FBQ3JFLDBCQUFxQixHQUFXLElBQUksQ0FBQztJQU03QyxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFnQjtRQUNoQyxnRUFBZ0U7UUFFaEUsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLDJCQUEyQixFQUFFLENBQUM7UUFFN0UsSUFBSSxDQUFDLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUU7WUFDakMsaUNBQWlDLEVBQUUsSUFBSTtTQUN4QyxDQUFDLENBQUM7UUFHSCxzQ0FBc0M7UUFDdEMsSUFBSSxhQUFhLENBQUMsS0FBSyxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzdFLENBQUM7SUFDSCxDQUFDOzhHQXpCVSxnQkFBZ0I7a0hBQWhCLGdCQUFnQixjQUZmLE1BQU07OzJGQUVQLGdCQUFnQjtrQkFINUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZpcmViYXNlQXBwIH0gZnJvbSAnZmlyZWJhc2UvYXBwJztcclxuaW1wb3J0IHsgRmlyZXN0b3JlLCBjb25uZWN0RmlyZXN0b3JlRW11bGF0b3IsIGluaXRpYWxpemVGaXJlc3RvcmUgfSBmcm9tIFwiZmlyZWJhc2UvZmlyZXN0b3JlXCI7XHJcbmltcG9ydCB7IFN5c3RlbVNlcnZpY2UgfSBmcm9tIFwiLi9zeXN0ZW0uc2VydmljZVwiO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlyZXN0b3JlU2VydmljZSB7XHJcblxyXG4gIC8vIHRoZSBwb3J0IHVzZWQgd2hlbiBlbXVsYXRpbmcgRmlyZXN0b3JlIHNlcnZpY2UgKG9ubHkgaW4gbG9jYWwgZW52aXJvbm1lbnQpXHJcbiAgcHJpdmF0ZSBmaXJlc3RvcmVFbXVsYXRvclBvcnQ6IG51bWJlciA9IDgwODA7XHJcblxyXG4gIC8vIHRoZSBGaXJlc3RvcmUgaW5zdGFuY2UgdXNlZCB0byBhY2Nlc3MgdW5kZXJseWluZyBjb2xsZWN0aW9ucy9kb2N1bWVudHNcclxuICBwdWJsaWMgZGIhOiBGaXJlc3RvcmU7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHN5c3RlbVNlcnZpY2U6IFN5c3RlbVNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBpbml0KGFwcDogRmlyZWJhc2VBcHApIHtcclxuICAgIC8vIEluaXRpYWxpemUgQ2xvdWQgRmlyZXN0b3JlIGFuZCBnZXQgYSByZWZlcmVuY2UgdG8gdGhlIHNlcnZpY2VcclxuXHJcbiAgICBjb25zdCBjb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5zeXN0ZW1TZXJ2aWNlLmdldEVudmlyb25tZW50Q29uZmlndXJhdGlvbigpO1xyXG5cclxuICAgIHRoaXMuZGIgPSBpbml0aWFsaXplRmlyZXN0b3JlKGFwcCwge1xyXG4gICAgICBleHBlcmltZW50YWxBdXRvRGV0ZWN0TG9uZ1BvbGxpbmc6IHRydWVcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBpbiBMb2NhbCwgd2UgdXNlIEZpcmVzdG9yZSBlbXVsYXRvclxyXG4gICAgaWYgKGNvbmZpZ3VyYXRpb24uc3RhZ2UgPT09ICdsb2NhbCcpIHtcclxuICAgICAgY29ubmVjdEZpcmVzdG9yZUVtdWxhdG9yKHRoaXMuZGIsICdsb2NhbGhvc3QnLCB0aGlzLmZpcmVzdG9yZUVtdWxhdG9yUG9ydCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==