import { Observable } from "rxjs";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { BaseEntity } from "../entities/_base-entity.class";
/**
 * This class is used to link a BaseEntity to its Observable and its Firestore DocumentReference
 */
export declare class FirestoreEntityWatcher<T extends BaseEntity> {
    observable: Observable<T | null> | null;
    documentRef: DocumentReference<DocumentData> | null;
    constructor(observable: Observable<T | null> | null | undefined, documentRef: DocumentReference<DocumentData> | null);
}
