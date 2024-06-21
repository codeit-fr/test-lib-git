import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class InstanceService {
    set instanceId(company) {
        this._instanceId$.next(company);
    }
    get instanceId$() {
        return this._instanceId$.asObservable();
    }
    constructor() {
        /**
         * Observable on the current instance name
         */
        this._instanceId$ = new BehaviorSubject(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: InstanceService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: InstanceService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: InstanceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbW1vbi1saWIvc3JjL2xpYi9zZXJ2aWNlcy9pbnN0YW5jZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQzs7QUFLbkQsTUFBTSxPQUFPLGVBQWU7SUFPMUIsSUFBVyxVQUFVLENBQUMsT0FBZTtRQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7UUFiQTs7V0FFRztRQUNPLGlCQUFZLEdBQW1DLElBQUksZUFBZSxDQUFnQixJQUFJLENBQUMsQ0FBQztJQVVsRixDQUFDOzhHQWZOLGVBQWU7a0hBQWYsZUFBZSxjQUZkLE1BQU07OzJGQUVQLGVBQWU7a0JBSDNCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlU2VydmljZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIE9ic2VydmFibGUgb24gdGhlIGN1cnJlbnQgaW5zdGFuY2UgbmFtZVxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBfaW5zdGFuY2VJZCQ6IEJlaGF2aW9yU3ViamVjdDxzdHJpbmcgfCBudWxsPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcblxyXG4gIHB1YmxpYyBzZXQgaW5zdGFuY2VJZChjb21wYW55OiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2luc3RhbmNlSWQkLm5leHQoY29tcGFueSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGluc3RhbmNlSWQkKCk6IE9ic2VydmFibGU8c3RyaW5nIHwgbnVsbD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlSWQkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcblxyXG5cclxufVxyXG4iXX0=