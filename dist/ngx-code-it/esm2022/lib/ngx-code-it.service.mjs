import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxCodeItService {
    constructor() { }
    LogUpdater(params) {
        console.log('LogUpdater', params);
    }
    LogEffect(params) {
        console.log('LogEffect', params);
    }
    LogObservable(groupMessage, observable, initialState) {
        console.log('LogObservable', groupMessage, observable, initialState);
    }
    LogState(params) {
        console.log('LogState', params);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: NgxCodeItService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: NgxCodeItService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: NgxCodeItService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNvZGUtaXQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1jb2RlLWl0L3NyYy9saWIvbmd4LWNvZGUtaXQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQU0zQyxNQUFNLE9BQU8sZ0JBQWdCO0lBRTNCLGdCQUFnQixDQUFDO0lBQ2pCLFVBQVUsQ0FBQyxNQUFXO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBVztRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsYUFBYSxDQUFDLFlBQW9CLEVBQUUsVUFBMkIsRUFBRSxZQUFpQjtRQUNoRixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxRQUFRLENBQUMsTUFBVztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDOzhHQWpCVSxnQkFBZ0I7a0hBQWhCLGdCQUFnQixjQUZmLE1BQU07OzJGQUVQLGdCQUFnQjtrQkFINUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4Q29kZUl0U2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgTG9nVXBkYXRlcihwYXJhbXM6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ0xvZ1VwZGF0ZXInLCBwYXJhbXMpO1xyXG4gIH1cclxuICBcclxuICBMb2dFZmZlY3QocGFyYW1zOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdMb2dFZmZlY3QnLCBwYXJhbXMpO1xyXG4gIH1cclxuICBcclxuICBMb2dPYnNlcnZhYmxlKGdyb3VwTWVzc2FnZTogc3RyaW5nLCBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPGFueT4sIGluaXRpYWxTdGF0ZTogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnTG9nT2JzZXJ2YWJsZScsIGdyb3VwTWVzc2FnZSwgb2JzZXJ2YWJsZSwgaW5pdGlhbFN0YXRlKTtcclxuICB9XHJcbiAgXHJcbiAgTG9nU3RhdGUocGFyYW1zOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdMb2dTdGF0ZScsIHBhcmFtcyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==