import { FirebaseApp } from 'firebase/app';
import { Firestore } from "firebase/firestore";
import { SystemService } from "./system.service";
import * as i0 from "@angular/core";
export declare class FirestoreService {
    private systemService;
    private firestoreEmulatorPort;
    db: Firestore;
    constructor(systemService: SystemService);
    init(app: FirebaseApp): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<FirestoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FirestoreService>;
}
