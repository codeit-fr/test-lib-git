import { Observable } from "rxjs";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { BaseEntity } from "../entities/_base-entity.class";

/**
 * This class is used to link a BaseEntity to its Observable and its Firestore DocumentReference
 */
export class FirestoreEntityWatcher<T extends BaseEntity> {
  public observable: Observable<T | null> | null = null;
  public documentRef: DocumentReference<DocumentData> | null = null;

  constructor(observable: Observable<T | null> | null = null, documentRef: DocumentReference<DocumentData> | null) {
    this.observable = observable;
    this.documentRef = documentRef;
  }

}