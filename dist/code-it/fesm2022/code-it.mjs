import * as i0 from '@angular/core';
import { Injectable, Component } from '@angular/core';

class CodeItService {
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

class CodeItComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CodeItComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.4", type: CodeItComponent, isStandalone: true, selector: "lib-code-it", ngImport: i0, template: `
    <p>
      code-it works!
    </p>
  `, isInline: true, styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CodeItComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-code-it', standalone: true, imports: [], template: `
    <p>
      code-it works!
    </p>
  ` }]
        }] });

/*
 * Public API Surface of code-it
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CodeItComponent, CodeItService };
//# sourceMappingURL=code-it.mjs.map
