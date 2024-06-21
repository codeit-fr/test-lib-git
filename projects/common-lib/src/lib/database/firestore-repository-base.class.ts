import { finalize, firstValueFrom, map, Observable, ReplaySubject } from 'rxjs';
import { Unsubscribe, User } from "firebase/auth";
import {
  addDoc, and, CollectionReference, deleteDoc, doc, DocumentData,
  DocumentReference, endAt, FieldPath, FirestoreDataConverter,
  getDoc, getDocs, limit, onSnapshot, or, orderBy, OrderByDirection, query,
  QueryConstraint, QueryDocumentSnapshot, QueryFieldFilterConstraint, setDoc, SnapshotOptions,
  startAfter, updateDoc, where, WhereFilterOp
} from 'firebase/firestore';
import { BaseEntity } from '../entities/_base-entity.class';

/**
 * Class used to filter request on Firestore collections
 */
export class Filter {
  fieldPath!: string | FieldPath;
  opStr!: WhereFilterOp;
  value: unknown;

  constructor(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown) {
    this.fieldPath = fieldPath;
    this.opStr = opStr;
    this.value = value;
  }
}

/**
 * Class used to order the request' results
 */
export class Ordering {
  field: string;
  direction: string;

  /**
   * Constructor
   */
  constructor(field: string, direction: string = "asc") {
    this.field = field;
    this.direction = direction;
  }
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
export class FirestoreRepositoryBase<T extends BaseEntity> implements FirestoreDataConverter<T> {

  // Firestore db path
  private dbPath$: Observable<CollectionReference<T>>;

  // User connected to Firestore
  private owner: string = '';
  private ownerId: string = '';

  private defaultLimitInList: number = 50;

  public constructor(protected entityConstructor: new () => T, dbPath: Observable<CollectionReference<DocumentData>>, $user: Observable<User | null>) {

    this.dbPath$ = dbPath.pipe(map(item => item.withConverter(this)));;

    // fill owner and ownerId from User information
    $user.subscribe(user => {
      if (user) {
        this.owner = <string>user.email;
        this.ownerId = user.uid;
      }
    });
  }

  /**
  * Firestore generic data converter
  */
  public toFirestore(doc: T): any {
    let ret: any = this.toAnonymousObject(doc);
    ret.lastModificationDate = doc.lastModificationDate?.toISOString() ?? new Date().toISOString();
    ret.creationDate = doc.creationDate?.toISOString();

    delete ret.id;
    delete ret.documentReference;

    return ret;
  }

  public fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions): T {
    const data = snapshot.data(options) as T;

    // create the T class from Firestore data
    let object = Object.assign(new this.entityConstructor(), data);

    // Convert every isostring Date to instance of date
    const anonymousObj: any = {};
    for (const key in object) {
      if (object.hasOwnProperty(key) && object[key] && this.isValidDate(object[key])) {
        anonymousObj[key] = new Date(object[key] as Date);
      }
    }
    Object.assign(object, anonymousObj);

    object.id = snapshot.id;
    object.documentReference = snapshot.ref;

    return object;
  }

  isValidDate(value: any) {

    if (typeof value === 'boolean') {
      return false;
    }
    if (typeof value === 'number') {
      return false;
    }


    // ISO 8601 date format regular expression
    const iso8601Regex = /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}(.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

    // Test the format
    if (!iso8601Regex.test(value)) {
      return false;
    }

    let date = new Date(value as Date);

    if (isNaN(date.getTime())) {
      return false;
    }

    let ret = date && Object.prototype.toString.call(date) === "[object Date]";
    return ret;
  }

  protected getCollectionReference(): Observable<CollectionReference<T>> {
    return this.dbPath$;
  }

  protected getDocumentReference(id: string | null = null): Observable<DocumentReference<T>> {
    return this.getCollectionReference().pipe(map(col => {
      if (id) {
        return doc(col, id);
      } else {
        return doc(col);
      }
    }))
  }

  public async getOneSnapshot(id: string): Promise<T | null> {
    const docRef = await firstValueFrom(this.getDocumentReference(id));
    return this.getOneSnapshotByDocumentReference(docRef);
  }

  public async getOneSnapshotByDocumentReference(reference: DocumentReference<T>) {
    var docSnap = await getDoc(reference.withConverter(this));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      return null;
    }
  }

  public getOne(id: string): Observable<T | null> {
    let subject = new ReplaySubject<T | null>(1);
    let documentRef$ = this.getDocumentReference(id);
    let unsubscribe: Unsubscribe;

    let documentRefSubscription = documentRef$.subscribe({
      next: (docRef) => {
        unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            subject.next(doc.data());
          } else {
            subject.next(null);
          }
        });
      }
    })

    return subject.pipe(finalize(() => {
      if (!subject.observed) {
        unsubscribe();
        documentRefSubscription.unsubscribe();
      }
    }));
  }

  public getOneByDocumentReference(docRef: DocumentReference<T>) {
    let subject = new ReplaySubject<T | null>(1);

    let unsubscribe: Unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        subject.next(doc.data());
      } else {
        subject.next(null);
      }
    });

    return subject.pipe(finalize(() => {
      if (!subject.observed) {
        unsubscribe();
      }
    }));
  }

  public getAll(orderBy: Ordering | null = null): Observable<T[]> {
    let params = { limit: 0 } as any;
    if (orderBy) {
      params['orderBy'] = [orderBy];
    }
    return this.list(params).pipe(map(g => g.result));
  }

  public getAllSnapshot(orderBy: Ordering | null = null): Promise<T[]> {
    let params = { limit: 0 } as any;
    if (orderBy) {
      params['orderBy'] = [orderBy];
    }
    return this.listSnapshot(params).then(g => g.result);
  }

  public list(options: IListOptions<T> | null = null): Observable<IListResult<T>> {
    options ??= {
      limit: this.defaultLimitInList,
      filtersAnd: [],
      startAfter: null,
      endAt: null,
      orderBy: []
    }

    //const whereOptions: QueryFieldFilterConstraint[] = options?.filters?.map(filter => { return where(filter.fieldPath, filter.opStr, filter.value) }) ?? [];; 
    const whereOptions = or(
      ...options.filtersOr?.map(filter => { return where(filter.fieldPath, filter.opStr, filter.value) }) ?? [],
      and(...options?.filtersAnd?.map(filter => { return where(filter.fieldPath, filter.opStr, filter.value) }) ?? [])
      );

    const orderByOptions = options?.orderBy?.map(order => { return orderBy(order.field, order.direction as OrderByDirection) }) ?? [];
    const cursorOptions: any = [];
    if (options.startAfter != null) {
      cursorOptions.push(startAfter(options.startAfter));
    } else if (options.endAt != null) {
      cursorOptions.push(endAt(options.endAt));
    }

    // The subject that we will return
    let subject = new ReplaySubject<IListResult<T>>();
    let onSnapshotUnsubscribe: any;

    let colletionRef$ = this.getCollectionReference();
    let collectionSubscription = colletionRef$.subscribe({
      next: (collection) => {
        let queryConstraint = [];
        queryConstraint.push(whereOptions);
        queryConstraint.push(...orderByOptions);
        queryConstraint.push(...cursorOptions);
        if (options?.limit) {
          queryConstraint.push(limit(options?.limit ?? this.defaultLimitInList));
        }
        const q = query(collection, ...queryConstraint);

        onSnapshotUnsubscribe = onSnapshot(q, (querySnapshot) => {
          const entities: T[] = [];

          let lastSnapshot: QueryDocumentSnapshot | null = null;

          querySnapshot.forEach((doc) => {
            const data = doc.data()
            entities.push(data);
            lastSnapshot = doc;
          });

          // We set the snapshot for the last element to be used for "startAfter"
          let paginationToken = lastSnapshot;

          subject.next({ result: entities, paginationToken });
        });
      }
    })

    return subject.pipe(finalize(() => {
      if (!subject.observed) {
        onSnapshotUnsubscribe();
        collectionSubscription.unsubscribe();
      }
    }));
  }

  /**
 * Fetches a snapshot of a Firestore collection based on the provided options.
 *
 * @param {IListOptions<T> | null} options - The options for the query.
 * @returns {Promise<IListResult<T>>} - A promise that resolves to the result of the query.
 */
  public async listSnapshot(options: IListOptions<T> | null = null): Promise<IListResult<T>> {
    // Set default options if none are provided.
    options ??= {
      limit: this.defaultLimitInList,
      filtersAnd: [],
      startAfter: null,
      endAt: null,
      orderBy: []
    }

    // Convert filters into Firestore 'where' constraints.
    const whereOptions = options?.filtersAnd?.map(filter => {
      return where(filter.fieldPath, filter.opStr, filter.value)
    }) ?? [];

    // Convert orderBy into Firestore 'orderBy' constraints.
    const orderByOptions = options?.orderBy?.map(order => {
      return orderBy(order.field, order.direction as OrderByDirection)
    }) ?? [];

    // Handle cursor options like 'startAfter' and 'endAt'.
    const cursorOptions: any = [];
    if (options.startAfter != null) {
      cursorOptions.push(startAfter(options.startAfter));
    } else if (options.endAt != null) {
      cursorOptions.push(endAt(options.endAt));
    }

    // Fetch the Firestore collection reference.
    const collectionRef = await firstValueFrom(this.getCollectionReference());

    // Combine all the query constraints.
    const queryConstraint: QueryConstraint[] = [];
    queryConstraint.push(...whereOptions);
    queryConstraint.push(...orderByOptions);
    queryConstraint.push(...cursorOptions);
    if (options?.limit) {
      queryConstraint.push(limit(options?.limit ?? this.defaultLimitInList));
    }

    // Create the Firestore query.
    const q = query(collectionRef, ...queryConstraint);

    // Execute the query to get the snapshot.
    const querySnapshot = await getDocs(q);
    const entities: T[] = [];

    let lastSnapshot: QueryDocumentSnapshot | null = null;

    // Iterate through the snapshot to extract data.
    querySnapshot.forEach((doc: any) => {
      const data = doc.data()
      entities.push(data);
      lastSnapshot = doc;
    });

    // Set the snapshot for the last element, which can be used for "startAfter" in pagination.
    let paginationToken = lastSnapshot;

    // Return the result.
    return { result: entities, paginationToken };
  }





  public async upsertAsync(item: T) {
    const docRef = await firstValueFrom(this.getDocumentReference(item.id));


    // Try to get the item if id not null
    if (item.id) {
      item.lastModificationDate = new Date;
    }
    else {
      item.id = docRef.id;
      item.owner = this.owner;
      item.ownerId = this.ownerId;
      item.creationDate = new Date();
    }
    await setDoc(docRef, item, { merge: true });
    return item;
  }

  async addAsync(item: T) {
    // Add a new document in the collection
    item.owner = this.owner;
    item.ownerId = this.ownerId;
    item.creationDate = new Date();
 
    if (item.id) {
      const docRef = await firstValueFrom(this.getDocumentReference(item.id));
      setDoc(docRef, item);
    } else {
      const collectionRef = await firstValueFrom(this.getCollectionReference());
      item.id = (await addDoc(collectionRef, item)).id;
    }
    return item;
  }

  /**
   * Partial update of a document
   * @param id
   * @param data
   */
  public async partialUpdate(id: string, data: any) {
    data.lastModifiedDate = new Date().toISOString();
    // We remove all undefined fields that are not supported by firebase
    data = this.removeEmpty(data);

    const docRef = await firstValueFrom(this.getDocumentReference(id));
    await updateDoc(docRef, data);
  }

  public async deleteAsync(id: string) {
    const docRef = await firstValueFrom(this.getDocumentReference(id));
    await deleteDoc(docRef);
  }

  /**
 * Recursively removes properties with undefined values from an object or array.
 * @param obj - The input object or array to be cleaned.
 * @returns A new object or array without properties or elements with undefined values.
 */
  private removeEmpty = (obj: any): any => {
    // Check if the input is an array or an object
    const isArray = Array.isArray(obj);
    let newObj: any = isArray ? [] : {};

    Object.keys(obj).forEach((key) => {
      // If the value is an object or an array, recursively clean it
      if (obj[key] === Object(obj[key])) {
        newObj[key] = this.removeEmpty(obj[key]);
      }
      // If the value is not undefined, add it to the new object or array
      else if (obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    });

    // If it's an array, filter out any undefined elements that might have been added during the recursion
    if (isArray) {
      newObj = newObj.filter((element: any) => element !== undefined);
    }

    return newObj;
  };

  /**
   * Convert any object to compatible Anonymous object for Firestore compli
   * @param obj Any object that needs to be converted
   * @returns
   */
  protected toAnonymousObject(obj: any): any {

    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // We must ignore these types as they create circular dependencies
    if (obj instanceof DocumentReference || obj instanceof Observable) {
      return null;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.toAnonymousObject(item));
    }

    if (obj instanceof Date) {
      return obj.toISOString();
    }

    const anonymousObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        anonymousObj[key] = this.toAnonymousObject(obj[key]);
      }
    }
    return anonymousObj;
  }
}
