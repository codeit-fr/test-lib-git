import * as i0 from '@angular/core';
import { Injectable, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

class NgxCodeItService {
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

class NgxCodeItComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: NgxCodeItComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.4", type: NgxCodeItComponent, isStandalone: true, selector: "lib-ngx-code-it", ngImport: i0, template: `
    <p>
      ngx-code-it works!
    </p>
  `, isInline: true, styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: NgxCodeItComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-ngx-code-it', standalone: true, imports: [CommonModule], template: `
    <p>
      ngx-code-it works!
    </p>
  ` }]
        }] });

/*
 * Public API Surface of ngx-code-it
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxCodeItComponent, NgxCodeItService };
//# sourceMappingURL=ngx-code-it.mjs.map
