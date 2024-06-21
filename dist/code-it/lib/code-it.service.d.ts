import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class CodeItService {
    constructor();
    LogUpdater(params: any): void;
    LogEffect(params: any): void;
    LogObservable(groupMessage: string, observable: Observable<any>, initialState: any): void;
    LogState(params: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CodeItService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CodeItService>;
}
