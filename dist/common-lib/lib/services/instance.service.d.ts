import { BehaviorSubject, Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class InstanceService {
    /**
     * Observable on the current instance name
     */
    protected _instanceId$: BehaviorSubject<string | null>;
    set instanceId(company: string);
    get instanceId$(): Observable<string | null>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<InstanceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InstanceService>;
}
