import { DocumentReference } from "firebase/firestore";
/**
 * Super-class of all Entities.
 * Also used in FirestoreRepositoryBase<T> to link BO entities with DB
 */
export declare class BaseEntity {
    id: string | null;
    creationDate?: Date;
    lastModificationDate?: Date;
    owner?: string;
    ownerId?: string;
    documentReference?: DocumentReference<any> | null;
    equals?(documentReferencePath: string): boolean;
    /**
     * Override to return a good stringified value
     */
    toString(): string;
}
