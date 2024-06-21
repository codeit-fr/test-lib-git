import { HttpClient } from "@angular/common/http";
import * as i0 from "@angular/core";
interface Configuration {
    stage: string;
    firebase: {};
}
export declare class SystemService {
    private http;
    constructor(http: HttpClient);
    getEnvironmentConfiguration(): Promise<Configuration>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SystemService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SystemService>;
}
export {};
