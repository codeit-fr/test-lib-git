import { Observable } from 'rxjs';
import { User } from "firebase/auth";
import { CollectionReference, DocumentData, DocumentReference, FieldPath, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WhereFilterOp } from 'firebase/firestore';
import { BaseEntity } from '../entities/_base-entity.class';
/**
 * Class used to filter request on Firestore collections
 */
export declare class Filter {
    fieldPath: string | FieldPath;
    opStr: WhereFilterOp;
    value: unknown;
    constructor(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown);
}
/**
 * Class used to order the request' results
 */
export declare class Ordering {
    field: string;
    direction: string;
    /**
     * Constructor
     */
    constructor(field: string, direction?: string);
}
/**
 * Main interface to set the request's options
 */
export interface IListOptions<T> {
    filtersAnd?: Filter[];
    filtersOr?: Filter[];
    orderBy?: Ordering[];
    startAfter?: T | null;
    endAt?: T | null;
    limit: number;
}
/**
 * Interface returned by the request
 */
export interface IListResult<T> {
    result: T[];
    paginationToken: any;
}
/**
 * Default class to CRUD any T object that extends BaseEntity into/from Firestore Db
 */
export declare class FirestoreRepositoryBase<T extends BaseEntity> implements FirestoreDataConverter<T> {
    protected entityConstructor: new () => T;
    private dbPath$;
    private owner;
    private ownerId;
    private defaultLimitInList;
    constructor(entityConstructor: new () => T, dbPath: Observable<CollectionReference<DocumentData>>, $user: Observable<User | null>);
    /**
    * Firestore generic data converter
    */
    toFirestore(doc: T): any;
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions): T;
    isValidDate(value: any): boolean;
    protected getCollectionReference(): Observable<CollectionReference<T>>;
    protected getDocumentReference(id?: string | null): Observable<DocumentReference<T>>;
    getOneSnapshot(id: string): Promise<T | null>;
    getOneSnapshotByDocumentReference(reference: DocumentReference<T>): Promise<T | null>;
    getOne(id: string): Observable<T | null>;
    getOneByDocumentReference(docRef: DocumentReference<T>): Observable<T | null>;
    getAll(orderBy?: Ordering | null): Observable<T[]>;
    getAllSnapshot(orderBy?: Ordering | null): Promise<T[]>;
    list(options?: IListOptions<T> | null): Observable<IListResult<T>>;
    /**
   * Fetches a snapshot of a Firestore collection based on the provided options.
   *
   * @param {IListOptions<T> | null} options - The options for the query.
   * @returns {Promise<IListResult<T>>} - A promise that resolves to the result of the query.
   */
    listSnapshot(options?: IListOptions<T> | null): Promise<IListResult<T>>;
    upsertAsync(item: T): Promise<T>;
    addAsync(item: T): Promise<T>;
    /**
     * Partial update of a document
     * @param id
     * @param data
     */
    partialUpdate(id: string, data: any): Promise<void>;
    deleteAsync(id: string): Promise<void>;
    /**
   * Recursively removes properties with undefined values from an object or array.
   * @param obj - The input object or array to be cleaned.
   * @returns A new object or array without properties or elements with undefined values.
   */
    private removeEmpty;
    /**
     * Convert any object to compatible Anonymous object for Firestore compli
     * @param obj Any object that needs to be converted
     * @returns
     */
    protected toAnonymousObject(obj: any): any;
}
