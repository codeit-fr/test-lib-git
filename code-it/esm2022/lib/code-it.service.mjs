import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class CodeItService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CodeItService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CodeItService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CodeItService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1pdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvY29kZS1pdC9zcmMvbGliL2NvZGUtaXQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQU0zQyxNQUFNLE9BQU8sYUFBYTtJQUV4QixnQkFBZ0IsQ0FBQztJQUNqQixVQUFVLENBQUMsTUFBVztRQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsU0FBUyxDQUFDLE1BQVc7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELGFBQWEsQ0FBQyxZQUFvQixFQUFFLFVBQTJCLEVBQUUsWUFBaUI7UUFDaEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQVc7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs4R0FqQlUsYUFBYTtrSEFBYixhQUFhLGNBRlosTUFBTTs7MkZBRVAsYUFBYTtrQkFIekIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIENvZGVJdFNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gIExvZ1VwZGF0ZXIocGFyYW1zOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdMb2dVcGRhdGVyJywgcGFyYW1zKTtcclxuICB9XHJcbiAgXHJcbiAgTG9nRWZmZWN0KHBhcmFtczogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnTG9nRWZmZWN0JywgcGFyYW1zKTtcclxuICB9XHJcbiAgXHJcbiAgTG9nT2JzZXJ2YWJsZShncm91cE1lc3NhZ2U6IHN0cmluZywgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+LCBpbml0aWFsU3RhdGU6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ0xvZ09ic2VydmFibGUnLCBncm91cE1lc3NhZ2UsIG9ic2VydmFibGUsIGluaXRpYWxTdGF0ZSk7XHJcbiAgfVxyXG4gIFxyXG4gIExvZ1N0YXRlKHBhcmFtczogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnTG9nU3RhdGUnLCBwYXJhbXMpO1xyXG4gIH1cclxufVxyXG4iXX0=