import { finalize, firstValueFrom, map, Observable, ReplaySubject } from 'rxjs';
import { addDoc, and, deleteDoc, doc, DocumentReference, endAt, getDoc, getDocs, limit, onSnapshot, or, orderBy, query, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
/**
 * Class used to filter request on Firestore collections
 */
export class Filter {
    constructor(fieldPath, opStr, value) {
        this.fieldPath = fieldPath;
        this.opStr = opStr;
        this.value = value;
    }
}
/**
 * Class used to order the request' results
 */
export class Ordering {
    /**
     * Constructor
     */
    constructor(field, direction = "asc") {
        this.field = field;
        this.direction = direction;
    }
}
/**
 * Default class to CRUD any T object that extends BaseEntity into/from Firestore Db
 */
export class FirestoreRepositoryBase {
    constructor(entityConstructor, dbPath, $user) {
        this.entityConstructor = entityConstructor;
        // User connected to Firestore
        this.owner = '';
        this.ownerId = '';
        this.defaultLimitInList = 50;
        /**
       * Recursively removes properties with undefined values from an object or array.
       * @param obj - The input object or array to be cleaned.
       * @returns A new object or array without properties or elements with undefined values.
       */
        this.removeEmpty = (obj) => {
            // Check if the input is an array or an object
            const isArray = Array.isArray(obj);
            let newObj = isArray ? [] : {};
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
                newObj = newObj.filter((element) => element !== undefined);
            }
            return newObj;
        };
        this.dbPath$ = dbPath.pipe(map(item => item.withConverter(this)));
        ;
        // fill owner and ownerId from User information
        $user.subscribe(user => {
            if (user) {
                this.owner = user.email;
                this.ownerId = user.uid;
            }
        });
    }
    /**
    * Firestore generic data converter
    */
    toFirestore(doc) {
        let ret = this.toAnonymousObject(doc);
        ret.lastModificationDate = doc.lastModificationDate?.toISOString() ?? new Date().toISOString();
        ret.creationDate = doc.creationDate?.toISOString();
        delete ret.id;
        delete ret.documentReference;
        return ret;
    }
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        // create the T class from Firestore data
        let object = Object.assign(new this.entityConstructor(), data);
        // Convert every isostring Date to instance of date
        const anonymousObj = {};
        for (const key in object) {
            if (object.hasOwnProperty(key) && object[key] && this.isValidDate(object[key])) {
                anonymousObj[key] = new Date(object[key]);
            }
        }
        Object.assign(object, anonymousObj);
        object.id = snapshot.id;
        object.documentReference = snapshot.ref;
        return object;
    }
    isValidDate(value) {
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
        let date = new Date(value);
        if (isNaN(date.getTime())) {
            return false;
        }
        let ret = date && Object.prototype.toString.call(date) === "[object Date]";
        return ret;
    }
    getCollectionReference() {
        return this.dbPath$;
    }
    getDocumentReference(id = null) {
        return this.getCollectionReference().pipe(map(col => {
            if (id) {
                return doc(col, id);
            }
            else {
                return doc(col);
            }
        }));
    }
    async getOneSnapshot(id) {
        const docRef = await firstValueFrom(this.getDocumentReference(id));
        return this.getOneSnapshotByDocumentReference(docRef);
    }
    async getOneSnapshotByDocumentReference(reference) {
        var docSnap = await getDoc(reference.withConverter(this));
        if (docSnap.exists()) {
            return docSnap.data();
        }
        else {
            // doc.data() will be undefined in this case
            return null;
        }
    }
    getOne(id) {
        let subject = new ReplaySubject(1);
        let documentRef$ = this.getDocumentReference(id);
        let unsubscribe;
        let documentRefSubscription = documentRef$.subscribe({
            next: (docRef) => {
                unsubscribe = onSnapshot(docRef, (doc) => {
                    if (doc.exists()) {
                        subject.next(doc.data());
                    }
                    else {
                        subject.next(null);
                    }
                });
            }
        });
        return subject.pipe(finalize(() => {
            if (!subject.observed) {
                unsubscribe();
                documentRefSubscription.unsubscribe();
            }
        }));
    }
    getOneByDocumentReference(docRef) {
        let subject = new ReplaySubject(1);
        let unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                subject.next(doc.data());
            }
            else {
                subject.next(null);
            }
        });
        return subject.pipe(finalize(() => {
            if (!subject.observed) {
                unsubscribe();
            }
        }));
    }
    getAll(orderBy = null) {
        let params = { limit: 0 };
        if (orderBy) {
            params['orderBy'] = [orderBy];
        }
        return this.list(params).pipe(map(g => g.result));
    }
    getAllSnapshot(orderBy = null) {
        let params = { limit: 0 };
        if (orderBy) {
            params['orderBy'] = [orderBy];
        }
        return this.listSnapshot(params).then(g => g.result);
    }
    list(options = null) {
        options ??= {
            limit: this.defaultLimitInList,
            filtersAnd: [],
            startAfter: null,
            endAt: null,
            orderBy: []
        };
        //const whereOptions: QueryFieldFilterConstraint[] = options?.filters?.map(filter => { return where(filter.fieldPath, filter.opStr, filter.value) }) ?? [];; 
        const whereOptions = or(...options.filtersOr?.map(filter => { return where(filter.fieldPath, filter.opStr, filter.value); }) ?? [], and(...options?.filtersAnd?.map(filter => { return where(filter.fieldPath, filter.opStr, filter.value); }) ?? []));
        const orderByOptions = options?.orderBy?.map(order => { return orderBy(order.field, order.direction); }) ?? [];
        const cursorOptions = [];
        if (options.startAfter != null) {
            cursorOptions.push(startAfter(options.startAfter));
        }
        else if (options.endAt != null) {
            cursorOptions.push(endAt(options.endAt));
        }
        // The subject that we will return
        let subject = new ReplaySubject();
        let onSnapshotUnsubscribe;
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
                    const entities = [];
                    let lastSnapshot = null;
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        entities.push(data);
                        lastSnapshot = doc;
                    });
                    // We set the snapshot for the last element to be used for "startAfter"
                    let paginationToken = lastSnapshot;
                    subject.next({ result: entities, paginationToken });
                });
            }
        });
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
    async listSnapshot(options = null) {
        // Set default options if none are provided.
        options ??= {
            limit: this.defaultLimitInList,
            filtersAnd: [],
            startAfter: null,
            endAt: null,
            orderBy: []
        };
        // Convert filters into Firestore 'where' constraints.
        const whereOptions = options?.filtersAnd?.map(filter => {
            return where(filter.fieldPath, filter.opStr, filter.value);
        }) ?? [];
        // Convert orderBy into Firestore 'orderBy' constraints.
        const orderByOptions = options?.orderBy?.map(order => {
            return orderBy(order.field, order.direction);
        }) ?? [];
        // Handle cursor options like 'startAfter' and 'endAt'.
        const cursorOptions = [];
        if (options.startAfter != null) {
            cursorOptions.push(startAfter(options.startAfter));
        }
        else if (options.endAt != null) {
            cursorOptions.push(endAt(options.endAt));
        }
        // Fetch the Firestore collection reference.
        const collectionRef = await firstValueFrom(this.getCollectionReference());
        // Combine all the query constraints.
        const queryConstraint = [];
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
        const entities = [];
        let lastSnapshot = null;
        // Iterate through the snapshot to extract data.
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            entities.push(data);
            lastSnapshot = doc;
        });
        // Set the snapshot for the last element, which can be used for "startAfter" in pagination.
        let paginationToken = lastSnapshot;
        // Return the result.
        return { result: entities, paginationToken };
    }
    async upsertAsync(item) {
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
    async addAsync(item) {
        // Add a new document in the collection
        item.owner = this.owner;
        item.ownerId = this.ownerId;
        item.creationDate = new Date();
        if (item.id) {
            const docRef = await firstValueFrom(this.getDocumentReference(item.id));
            setDoc(docRef, item);
        }
        else {
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
    async partialUpdate(id, data) {
        data.lastModifiedDate = new Date().toISOString();
        // We remove all undefined fields that are not supported by firebase
        data = this.removeEmpty(data);
        const docRef = await firstValueFrom(this.getDocumentReference(id));
        await updateDoc(docRef, data);
    }
    async deleteAsync(id) {
        const docRef = await firstValueFrom(this.getDocumentReference(id));
        await deleteDoc(docRef);
    }
    /**
     * Convert any object to compatible Anonymous object for Firestore compli
     * @param obj Any object that needs to be converted
     * @returns
     */
    toAnonymousObject(obj) {
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
        const anonymousObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                anonymousObj[key] = this.toAnonymousObject(obj[key]);
            }
        }
        return anonymousObj;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZXN0b3JlLXJlcG9zaXRvcnktYmFzZS5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbW1vbi1saWIvc3JjL2xpYi9kYXRhYmFzZS9maXJlc3RvcmUtcmVwb3NpdG9yeS1iYXNlLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWhGLE9BQU8sRUFDTCxNQUFNLEVBQUUsR0FBRyxFQUF1QixTQUFTLEVBQUUsR0FBRyxFQUNoRCxpQkFBaUIsRUFBRSxLQUFLLEVBQ3hCLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFvQixLQUFLLEVBQ0osTUFBTSxFQUMxRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFDN0IsTUFBTSxvQkFBb0IsQ0FBQztBQUc1Qjs7R0FFRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBS2pCLFlBQVksU0FBNkIsRUFBRSxLQUFvQixFQUFFLEtBQWM7UUFDN0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sUUFBUTtJQUluQjs7T0FFRztJQUNILFlBQVksS0FBYSxFQUFFLFlBQW9CLEtBQUs7UUFDbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBc0JEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLHVCQUF1QjtJQVdsQyxZQUE2QixpQkFBOEIsRUFB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aXJzdFZhbHVlRnJvbSwgbWFwLCBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFVuc3Vic2NyaWJlLCBVc2VyIH0gZnJvbSBcImZpcmViYXNlL2F1dGhcIjtcclxuaW1wb3J0IHtcclxuICBhZGREb2MsIGFuZCwgQ29sbGVjdGlvblJlZmVyZW5jZSwgZGVsZXRlRG9jLCBkb2MsIERvY3VtZW50RGF0YSxcclxuICBEb2N1bWVudFJlZmVyZW5jZSwgZW5kQXQsIEZpZWxkUGF0aCwgRmlyZXN0b3JlRGF0YUNvbnZlcnRlcixcclxuICBnZXREb2MsIGdldERvY3MsIGxpbWl0LCBvblNuYXBzaG90LCBvciwgb3JkZXJCeSwgT3JkZXJCeURpcmVjdGlvbiwgcXVlcnksXHJcbiAgUXVlcnlDb25zdHJhaW50LCBRdWVyeURvY3VtZW50U25hcHNob3QsIFF1ZXJ5RmllbGRGaWx0ZXJDb25zdHJhaW50LCBzZXREb2MsIFNuYXBzaG90T3B0aW9ucyxcclxuICBzdGFydEFmdGVyLCB1cGRhdGVEb2MsIHdoZXJlLCBXaGVyZUZpbHRlck9wXHJcbn0gZnJvbSAnZmlyZWJhc2UvZmlyZXN0b3JlJztcclxuaW1wb3J0IHsgQmFzZUVudGl0eSB9IGZyb20gJy4uL2VudGl0aWVzL19iYXNlLWVudGl0eS5jbGFzcyc7XHJcblxyXG4vKipcclxuICogQ2xhc3MgdXNlZCB0byBmaWx0ZXIgcmVxdWVzdCBvbiBGaXJlc3RvcmUgY29sbGVjdGlvbnNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBGaWx0ZXIge1xyXG4gIGZpZWxkUGF0aCE6IHN0cmluZyB8IEZpZWxkUGF0aDtcclxuICBvcFN0ciE6IFdoZXJlRmlsdGVyT3A7XHJcbiAgdmFsdWU6IHVua25vd247XHJcblxyXG4gIGNvbnN0cnVjdG9yKGZpZWxkUGF0aDogc3RyaW5nIHwgRmllbGRQYXRoLCBvcFN0cjogV2hlcmVGaWx0ZXJPcCwgdmFsdWU6IHVua25vd24pIHtcclxuICAgIHRoaXMuZmllbGRQYXRoID0gZmllbGRQYXRoO1xyXG4gICAgdGhpcy5vcFN0ciA9IG9wU3RyO1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIHVzZWQgdG8gb3JkZXIgdGhlIHJlcXVlc3QnIHJlc3VsdHNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBPcmRlcmluZyB7XHJcbiAgZmllbGQ6IHN0cmluZztcclxuICBkaXJlY3Rpb246IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0b3JcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihmaWVsZDogc3RyaW5nLCBkaXJlY3Rpb246IHN0cmluZyA9IFwiYXNjXCIpIHtcclxuICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1haW4gaW50ZXJmYWNlIHRvIHNldCB0aGUgcmVxdWVzdCdzIG9wdGlvbnNcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxpc3RPcHRpb25zPFQ+IHtcclxuICBmaWx0ZXJzQW5kPzogRmlsdGVyW107XHJcbiAgZmlsdGVyc09yPzogRmlsdGVyW107XHJcbiAgb3JkZXJCeT86IE9yZGVyaW5nW107XHJcbiAgc3RhcnRBZnRlcj86IFQgfCBudWxsO1xyXG4gIGVuZEF0PzogVCB8IG51bGw7XHJcbiAgbGltaXQ6IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEludGVyZmFjZSByZXR1cm5lZCBieSB0aGUgcmVxdWVzdFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJTGlzdFJlc3VsdDxUPiB7XHJcbiAgcmVzdWx0OiBUW107XHJcbiAgcGFnaW5hdGlvblRva2VuOiBhbnk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZWZhdWx0IGNsYXNzIHRvIENSVUQgYW55IFQgb2JqZWN0IHRoYXQgZXh0ZW5kcyBCYXNlRW50aXR5IGludG8vZnJvbSBGaXJlc3RvcmUgRGJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBGaXJlc3RvcmVSZXBvc2l0b3J5QmFzZTxUIGV4dGVuZHMgQmFzZUVudGl0eT4gaW1wbGVtZW50cyBGaXJlc3RvcmVEYXRhQ29udmVydGVyPFQ+IHtcclxuXHJcbiAgLy8gRmlyZXN0b3JlIGRiIHBhdGhcclxuICBwcml2YXRlIGRiUGF0aCQ6IE9ic2VydmFibGU8Q29sbGVjdGlvblJlZmVyZW5jZTxUPj47XHJcblxyXG4gIC8vIFVzZXIgY29ubmVjdGVkIHRvIEZpcmVzdG9yZVxyXG4gIHByaXZhdGUgb3duZXI6IHN0cmluZyA9ICcnO1xyXG4gIHByaXZhdGUgb3duZXJJZDogc3RyaW5nID0gJyc7XHJcblxyXG4gIHByaXZhdGUgZGVmYXVsdExpbWl0SW5MaXN0OiBudW1iZXIgPSA1MDtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbnRpdHlDb25zdHJ1Y3RvcjogbmV3ICgpID0+IFQsIGRiUGF0aDogT2JzZXJ2YWJsZTxDb2xsZWN0aW9uUmVmZXJlbmNlPERvY3VtZW50RGF0YT4+LCAkdXNlcjogT2JzZXJ2YWJsZTxVc2VyIHwgbnVsbD4pIHtcclxuXHJcbiAgICB0aGlzLmRiUGF0aCQgPSBkYlBhdGgucGlwZShtYXAoaXRlbSA9PiBpdGVtLndpdGhDb252ZXJ0ZXIodGhpcykpKTs7XHJcblxyXG4gICAgLy8gZmlsbCBvd25lciBhbmQgb3duZXJJZCBmcm9tIFVzZXIgaW5mb3JtYXRpb25cclxuICAgICR1c2VyLnN1YnNjcmliZSh1c2VyID0+IHtcclxuICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICB0aGlzLm93bmVyID0gPHN0cmluZz51c2VyLmVtYWlsO1xyXG4gICAgICAgIHRoaXMub3duZXJJZCA9IHVzZXIudWlkO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogRmlyZXN0b3JlIGdlbmVyaWMgZGF0YSBjb252ZXJ0ZXJcclxuICAqL1xyXG4gIHB1YmxpYyB0b0ZpcmVzdG9yZShkb2M6IFQpOiBhbnkge1xyXG4gICAgbGV0IHJldDogYW55ID0gdGhpcy50b0Fub255bW91c09iamVjdChkb2MpO1xyXG4gICAgcmV0Lmxhc3RNb2RpZmljYXRpb25EYXRlID0gZG9jLmxhc3RNb2RpZmljYXRpb25EYXRlPy50b0lTT1N0cmluZygpID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcclxuICAgIHJldC5jcmVhdGlvbkRhdGUgPSBkb2MuY3JlYXRpb25EYXRlPy50b0lTT1N0cmluZygpO1xyXG5cclxuICAgIGRlbGV0ZSByZXQuaWQ7XHJcbiAgICBkZWxldGUgcmV0LmRvY3VtZW50UmVmZXJlbmNlO1xyXG5cclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZnJvbUZpcmVzdG9yZShzbmFwc2hvdDogUXVlcnlEb2N1bWVudFNuYXBzaG90PERvY3VtZW50RGF0YT4sIG9wdGlvbnM6IFNuYXBzaG90T3B0aW9ucyk6IFQge1xyXG4gICAgY29uc3QgZGF0YSA9IHNuYXBzaG90LmRhdGEob3B0aW9ucykgYXMgVDtcclxuXHJcbiAgICAvLyBjcmVhdGUgdGhlIFQgY2xhc3MgZnJvbSBGaXJlc3RvcmUgZGF0YVxyXG4gICAgbGV0IG9iamVjdCA9IE9iamVjdC5hc3NpZ24obmV3IHRoaXMuZW50aXR5Q29uc3RydWN0b3IoKSwgZGF0YSk7XHJcblxyXG4gICAgLy8gQ29udmVydCBldmVyeSBpc29zdHJpbmcgRGF0ZSB0byBpbnN0YW5jZSBvZiBkYXRlXHJcbiAgICBjb25zdCBhbm9ueW1vdXNPYmo6IGFueSA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XHJcbiAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBvYmplY3Rba2V5XSAmJiB0aGlzLmlzVmFsaWREYXRlKG9iamVjdFtrZXldKSkge1xyXG4gICAgICAgIGFub255bW91c09ialtrZXldID0gbmV3IERhdGUob2JqZWN0W2tleV0gYXMgRGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIE9iamVjdC5hc3NpZ24ob2JqZWN0LCBhbm9ueW1vdXNPYmopO1xyXG5cclxuICAgIG9iamVjdC5pZCA9IHNuYXBzaG90LmlkO1xyXG4gICAgb2JqZWN0LmRvY3VtZW50UmVmZXJlbmNlID0gc25hcHNob3QucmVmO1xyXG5cclxuICAgIHJldHVybiBvYmplY3Q7XHJcbiAgfVxyXG5cclxuICBpc1ZhbGlkRGF0ZSh2YWx1ZTogYW55KSB7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gSVNPIDg2MDEgZGF0ZSBmb3JtYXQgcmVndWxhciBleHByZXNzaW9uXHJcbiAgICBjb25zdCBpc284NjAxUmVnZXggPSAvXihcXGR7NH0tXFxkezJ9LVxcZHsyfSkoVFxcZHsyfTpcXGR7Mn06XFxkezJ9KC5cXGQrKT8oWnxbKy1dXFxkezJ9OlxcZHsyfSk/KT8kLztcclxuXHJcbiAgICAvLyBUZXN0IHRoZSBmb3JtYXRcclxuICAgIGlmICghaXNvODYwMVJlZ2V4LnRlc3QodmFsdWUpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlIGFzIERhdGUpO1xyXG5cclxuICAgIGlmIChpc05hTihkYXRlLmdldFRpbWUoKSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXQgPSBkYXRlICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlKSA9PT0gXCJbb2JqZWN0IERhdGVdXCI7XHJcbiAgICByZXR1cm4gcmV0O1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGdldENvbGxlY3Rpb25SZWZlcmVuY2UoKTogT2JzZXJ2YWJsZTxDb2xsZWN0aW9uUmVmZXJlbmNlPFQ+PiB7XHJcbiAgICByZXR1cm4gdGhpcy5kYlBhdGgkO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGdldERvY3VtZW50UmVmZXJlbmNlKGlkOiBzdHJpbmcgfCBudWxsID0gbnVsbCk6IE9ic2VydmFibGU8RG9jdW1lbnRSZWZlcmVuY2U8VD4+IHtcclxuICAgIHJldHVybiB0aGlzLmdldENvbGxlY3Rpb25SZWZlcmVuY2UoKS5waXBlKG1hcChjb2wgPT4ge1xyXG4gICAgICBpZiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gZG9jKGNvbCwgaWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBkb2MoY29sKTtcclxuICAgICAgfVxyXG4gICAgfSkpXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0T25lU25hcHNob3QoaWQ6IHN0cmluZyk6IFByb21pc2U8VCB8IG51bGw+IHtcclxuICAgIGNvbnN0IGRvY1JlZiA9IGF3YWl0IGZpcnN0VmFsdWVGcm9tKHRoaXMuZ2V0RG9jdW1lbnRSZWZlcmVuY2UoaWQpKTtcclxuICAgIHJldHVybiB0aGlzLmdldE9uZVNuYXBzaG90QnlEb2N1bWVudFJlZmVyZW5jZShkb2NSZWYpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldE9uZVNuYXBzaG90QnlEb2N1bWVudFJlZmVyZW5jZShyZWZlcmVuY2U6IERvY3VtZW50UmVmZXJlbmNlPFQ+KSB7XHJcbiAgICB2YXIgZG9jU25hcCA9IGF3YWl0IGdldERvYyhyZWZlcmVuY2Uud2l0aENvbnZlcnRlcih0aGlzKSk7XHJcbiAgICBpZiAoZG9jU25hcC5leGlzdHMoKSkge1xyXG4gICAgICByZXR1cm4gZG9jU25hcC5kYXRhKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBkb2MuZGF0YSgpIHdpbGwgYmUgdW5kZWZpbmVkIGluIHRoaXMgY2FzZVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRPbmUoaWQ6IHN0cmluZyk6IE9ic2VydmFibGU8VCB8IG51bGw+IHtcclxuICAgIGxldCBzdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8VCB8IG51bGw+KDEpO1xyXG4gICAgbGV0IGRvY3VtZW50UmVmJCA9IHRoaXMuZ2V0RG9jdW1lbnRSZWZlcmVuY2UoaWQpO1xyXG4gICAgbGV0IHVuc3Vic2NyaWJlOiBVbnN1YnNjcmliZTtcclxuXHJcbiAgICBsZXQgZG9jdW1lbnRSZWZTdWJzY3JpcHRpb24gPSBkb2N1bWVudFJlZiQuc3Vic2NyaWJlKHtcclxuICAgICAgbmV4dDogKGRvY1JlZikgPT4ge1xyXG4gICAgICAgIHVuc3Vic2NyaWJlID0gb25TbmFwc2hvdChkb2NSZWYsIChkb2MpID0+IHtcclxuICAgICAgICAgIGlmIChkb2MuZXhpc3RzKCkpIHtcclxuICAgICAgICAgICAgc3ViamVjdC5uZXh0KGRvYy5kYXRhKCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3ViamVjdC5uZXh0KG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiBzdWJqZWN0LnBpcGUoZmluYWxpemUoKCkgPT4ge1xyXG4gICAgICBpZiAoIXN1YmplY3Qub2JzZXJ2ZWQpIHtcclxuICAgICAgICB1bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIGRvY3VtZW50UmVmU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRPbmVCeURvY3VtZW50UmVmZXJlbmNlKGRvY1JlZjogRG9jdW1lbnRSZWZlcmVuY2U8VD4pIHtcclxuICAgIGxldCBzdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8VCB8IG51bGw+KDEpO1xyXG5cclxuICAgIGxldCB1bnN1YnNjcmliZTogVW5zdWJzY3JpYmUgPSBvblNuYXBzaG90KGRvY1JlZiwgKGRvYykgPT4ge1xyXG4gICAgICBpZiAoZG9jLmV4aXN0cygpKSB7XHJcbiAgICAgICAgc3ViamVjdC5uZXh0KGRvYy5kYXRhKCkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN1YmplY3QubmV4dChudWxsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHN1YmplY3QucGlwZShmaW5hbGl6ZSgoKSA9PiB7XHJcbiAgICAgIGlmICghc3ViamVjdC5vYnNlcnZlZCkge1xyXG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRBbGwob3JkZXJCeTogT3JkZXJpbmcgfCBudWxsID0gbnVsbCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICBsZXQgcGFyYW1zID0geyBsaW1pdDogMCB9IGFzIGFueTtcclxuICAgIGlmIChvcmRlckJ5KSB7XHJcbiAgICAgIHBhcmFtc1snb3JkZXJCeSddID0gW29yZGVyQnldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMubGlzdChwYXJhbXMpLnBpcGUobWFwKGcgPT4gZy5yZXN1bHQpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRBbGxTbmFwc2hvdChvcmRlckJ5OiBPcmRlcmluZyB8IG51bGwgPSBudWxsKTogUHJvbWlzZTxUW10+IHtcclxuICAgIGxldCBwYXJhbXMgPSB7IGxpbWl0OiAwIH0gYXMgYW55O1xyXG4gICAgaWYgKG9yZGVyQnkpIHtcclxuICAgICAgcGFyYW1zWydvcmRlckJ5J10gPSBbb3JkZXJCeV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5saXN0U25hcHNob3QocGFyYW1zKS50aGVuKGcgPT4gZy5yZXN1bHQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGxpc3Qob3B0aW9uczogSUxpc3RPcHRpb25zPFQ+IHwgbnVsbCA9IG51bGwpOiBPYnNlcnZhYmxlPElMaXN0UmVzdWx0PFQ+PiB7XHJcbiAgICBvcHRpb25zID8/PSB7XHJcbiAgICAgIGxpbWl0OiB0aGlzLmRlZmF1bHRMaW1pdEluTGlzdCxcclxuICAgICAgZmlsdGVyc0FuZDogW10sXHJcbiAgICAgIHN0YXJ0QWZ0ZXI6IG51bGwsXHJcbiAgICAgIGVuZEF0OiBudWxsLFxyXG4gICAgICBvcmRlckJ5OiBbXVxyXG4gICAgfVxyXG5cclxuICAgIC8vY29uc3Qgd2hlcmVPcHRpb25zOiBRdWVyeUZpZWxkRmlsdGVyQ29uc3RyYWludFtdID0gb3B0aW9ucz8uZmlsdGVycz8ubWFwKGZpbHRlciA9PiB7IHJldHVybiB3aGVyZShmaWx0ZXIuZmllbGRQYXRoLCBmaWx0ZXIub3BTdHIsIGZpbHRlci52YWx1ZSkgfSkgPz8gW107OyBcclxuICAgIGNvbnN0IHdoZXJlT3B0aW9ucyA9IG9yKFxyXG4gICAgICAuLi5vcHRpb25zLmZpbHRlcnNPcj8ubWFwKGZpbHRlciA9PiB7IHJldHVybiB3aGVyZShmaWx0ZXIuZmllbGRQYXRoLCBmaWx0ZXIub3BTdHIsIGZpbHRlci52YWx1ZSkgfSkgPz8gW10sXHJcbiAgICAgIGFuZCguLi5vcHRpb25zPy5maWx0ZXJzQW5kPy5tYXAoZmlsdGVyID0+IHsgcmV0dXJuIHdoZXJlKGZpbHRlci5maWVsZFBhdGgsIGZpbHRlci5vcFN0ciwgZmlsdGVyLnZhbHVlKSB9KSA/PyBbXSlcclxuICAgICAgKTtcclxuXHJcbiAgICBjb25zdCBvcmRlckJ5T3B0aW9ucyA9IG9wdGlvbnM/Lm9yZGVyQnk/Lm1hcChvcmRlciA9PiB7IHJldHVybiBvcmRlckJ5KG9yZGVyLmZpZWxkLCBvcmRlci5kaXJlY3Rpb24gYXMgT3JkZXJCeURpcmVjdGlvbikgfSkgPz8gW107XHJcbiAgICBjb25zdCBjdXJzb3JPcHRpb25zOiBhbnkgPSBbXTtcclxuICAgIGlmIChvcHRpb25zLnN0YXJ0QWZ0ZXIgIT0gbnVsbCkge1xyXG4gICAgICBjdXJzb3JPcHRpb25zLnB1c2goc3RhcnRBZnRlcihvcHRpb25zLnN0YXJ0QWZ0ZXIpKTtcclxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5lbmRBdCAhPSBudWxsKSB7XHJcbiAgICAgIGN1cnNvck9wdGlvbnMucHVzaChlbmRBdChvcHRpb25zLmVuZEF0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhlIHN1YmplY3QgdGhhdCB3ZSB3aWxsIHJldHVyblxyXG4gICAgbGV0IHN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxJTGlzdFJlc3VsdDxUPj4oKTtcclxuICAgIGxldCBvblNuYXBzaG90VW5zdWJzY3JpYmU6IGFueTtcclxuXHJcbiAgICBsZXQgY29sbGV0aW9uUmVmJCA9IHRoaXMuZ2V0Q29sbGVjdGlvblJlZmVyZW5jZSgpO1xyXG4gICAgbGV0IGNvbGxlY3Rpb25TdWJzY3JpcHRpb24gPSBjb2xsZXRpb25SZWYkLnN1YnNjcmliZSh7XHJcbiAgICAgIG5leHQ6IChjb2xsZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5Q29uc3RyYWludCA9IFtdO1xyXG4gICAgICAgIHF1ZXJ5Q29uc3RyYWludC5wdXNoKHdoZXJlT3B0aW9ucyk7XHJcbiAgICAgICAgcXVlcnlDb25zdHJhaW50LnB1c2goLi4ub3JkZXJCeU9wdGlvbnMpO1xyXG4gICAgICAgIHF1ZXJ5Q29uc3RyYWludC5wdXNoKC4uLmN1cnNvck9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zPy5saW1pdCkge1xyXG4gICAgICAgICAgcXVlcnlDb25zdHJhaW50LnB1c2gobGltaXQob3B0aW9ucz8ubGltaXQgPz8gdGhpcy5kZWZhdWx0TGltaXRJbkxpc3QpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcSA9IHF1ZXJ5KGNvbGxlY3Rpb24sIC4uLnF1ZXJ5Q29uc3RyYWludCk7XHJcblxyXG4gICAgICAgIG9uU25hcHNob3RVbnN1YnNjcmliZSA9IG9uU25hcHNob3QocSwgKHF1ZXJ5U25hcHNob3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGVudGl0aWVzOiBUW10gPSBbXTtcclxuXHJcbiAgICAgICAgICBsZXQgbGFzdFNuYXBzaG90OiBRdWVyeURvY3VtZW50U25hcHNob3QgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICBxdWVyeVNuYXBzaG90LmZvckVhY2goKGRvYykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZG9jLmRhdGEoKVxyXG4gICAgICAgICAgICBlbnRpdGllcy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICBsYXN0U25hcHNob3QgPSBkb2M7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBXZSBzZXQgdGhlIHNuYXBzaG90IGZvciB0aGUgbGFzdCBlbGVtZW50IHRvIGJlIHVzZWQgZm9yIFwic3RhcnRBZnRlclwiXHJcbiAgICAgICAgICBsZXQgcGFnaW5hdGlvblRva2VuID0gbGFzdFNuYXBzaG90O1xyXG5cclxuICAgICAgICAgIHN1YmplY3QubmV4dCh7IHJlc3VsdDogZW50aXRpZXMsIHBhZ2luYXRpb25Ub2tlbiB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gc3ViamVjdC5waXBlKGZpbmFsaXplKCgpID0+IHtcclxuICAgICAgaWYgKCFzdWJqZWN0Lm9ic2VydmVkKSB7XHJcbiAgICAgICAgb25TbmFwc2hvdFVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgY29sbGVjdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICogRmV0Y2hlcyBhIHNuYXBzaG90IG9mIGEgRmlyZXN0b3JlIGNvbGxlY3Rpb24gYmFzZWQgb24gdGhlIHByb3ZpZGVkIG9wdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SUxpc3RPcHRpb25zPFQ+IHwgbnVsbH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIGZvciB0aGUgcXVlcnkuXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPElMaXN0UmVzdWx0PFQ+Pn0gLSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgcmVzdWx0IG9mIHRoZSBxdWVyeS5cclxuICovXHJcbiAgcHVibGljIGFzeW5jIGxpc3RTbmFwc2hvdChvcHRpb25zOiBJTGlzdE9wdGlvbnM8VD4gfCBudWxsID0gbnVsbCk6IFByb21pc2U8SUxpc3RSZXN1bHQ8VD4+IHtcclxuICAgIC8vIFNldCBkZWZhdWx0IG9wdGlvbnMgaWYgbm9uZSBhcmUgcHJvdmlkZWQuXHJcbiAgICBvcHRpb25zID8/PSB7XHJcbiAgICAgIGxpbWl0OiB0aGlzLmRlZmF1bHRMaW1pdEluTGlzdCxcclxuICAgICAgZmlsdGVyc0FuZDogW10sXHJcbiAgICAgIHN0YXJ0QWZ0ZXI6IG51bGwsXHJcbiAgICAgIGVuZEF0OiBudWxsLFxyXG4gICAgICBvcmRlckJ5OiBbXVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbnZlcnQgZmlsdGVycyBpbnRvIEZpcmVzdG9yZSAnd2hlcmUnIGNvbnN0cmFpbnRzLlxyXG4gICAgY29uc3Qgd2hlcmVPcHRpb25zID0gb3B0aW9ucz8uZmlsdGVyc0FuZD8ubWFwKGZpbHRlciA9PiB7XHJcbiAgICAgIHJldHVybiB3aGVyZShmaWx0ZXIuZmllbGRQYXRoLCBmaWx0ZXIub3BTdHIsIGZpbHRlci52YWx1ZSlcclxuICAgIH0pID8/IFtdO1xyXG5cclxuICAgIC8vIENvbnZlcnQgb3JkZXJCeSBpbnRvIEZpcmVzdG9yZSAnb3JkZXJCeScgY29uc3RyYWludHMuXHJcbiAgICBjb25zdCBvcmRlckJ5T3B0aW9ucyA9IG9wdGlvbnM/Lm9yZGVyQnk/Lm1hcChvcmRlciA9PiB7XHJcbiAgICAgIHJldHVybiBvcmRlckJ5KG9yZGVyLmZpZWxkLCBvcmRlci5kaXJlY3Rpb24gYXMgT3JkZXJCeURpcmVjdGlvbilcclxuICAgIH0pID8/IFtdO1xyXG5cclxuICAgIC8vIEhhbmRsZSBjdXJzb3Igb3B0aW9ucyBsaWtlICdzdGFydEFmdGVyJyBhbmQgJ2VuZEF0Jy5cclxuICAgIGNvbnN0IGN1cnNvck9wdGlvbnM6IGFueSA9IFtdO1xyXG4gICAgaWYgKG9wdGlvbnMuc3RhcnRBZnRlciAhPSBudWxsKSB7XHJcbiAgICAgIGN1cnNvck9wdGlvbnMucHVzaChzdGFydEFmdGVyKG9wdGlvbnMuc3RhcnRBZnRlcikpO1xyXG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmVuZEF0ICE9IG51bGwpIHtcclxuICAgICAgY3Vyc29yT3B0aW9ucy5wdXNoKGVuZEF0KG9wdGlvbnMuZW5kQXQpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGZXRjaCB0aGUgRmlyZXN0b3JlIGNvbGxlY3Rpb24gcmVmZXJlbmNlLlxyXG4gICAgY29uc3QgY29sbGVjdGlvblJlZiA9IGF3YWl0IGZpcnN0VmFsdWVGcm9tKHRoaXMuZ2V0Q29sbGVjdGlvblJlZmVyZW5jZSgpKTtcclxuXHJcbiAgICAvLyBDb21iaW5lIGFsbCB0aGUgcXVlcnkgY29uc3RyYWludHMuXHJcbiAgICBjb25zdCBxdWVyeUNvbnN0cmFpbnQ6IFF1ZXJ5Q29uc3RyYWludFtdID0gW107XHJcbiAgICBxdWVyeUNvbnN0cmFpbnQucHVzaCguLi53aGVyZU9wdGlvbnMpO1xyXG4gICAgcXVlcnlDb25zdHJhaW50LnB1c2goLi4ub3JkZXJCeU9wdGlvbnMpO1xyXG4gICAgcXVlcnlDb25zdHJhaW50LnB1c2goLi4uY3Vyc29yT3B0aW9ucyk7XHJcbiAgICBpZiAob3B0aW9ucz8ubGltaXQpIHtcclxuICAgICAgcXVlcnlDb25zdHJhaW50LnB1c2gobGltaXQob3B0aW9ucz8ubGltaXQgPz8gdGhpcy5kZWZhdWx0TGltaXRJbkxpc3QpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDcmVhdGUgdGhlIEZpcmVzdG9yZSBxdWVyeS5cclxuICAgIGNvbnN0IHEgPSBxdWVyeShjb2xsZWN0aW9uUmVmLCAuLi5xdWVyeUNvbnN0cmFpbnQpO1xyXG5cclxuICAgIC8vIEV4ZWN1dGUgdGhlIHF1ZXJ5IHRvIGdldCB0aGUgc25hcHNob3QuXHJcbiAgICBjb25zdCBxdWVyeVNuYXBzaG90ID0gYXdhaXQgZ2V0RG9jcyhxKTtcclxuICAgIGNvbnN0IGVudGl0aWVzOiBUW10gPSBbXTtcclxuXHJcbiAgICBsZXQgbGFzdFNuYXBzaG90OiBRdWVyeURvY3VtZW50U25hcHNob3QgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIHNuYXBzaG90IHRvIGV4dHJhY3QgZGF0YS5cclxuICAgIHF1ZXJ5U25hcHNob3QuZm9yRWFjaCgoZG9jOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGRvYy5kYXRhKClcclxuICAgICAgZW50aXRpZXMucHVzaChkYXRhKTtcclxuICAgICAgbGFzdFNuYXBzaG90ID0gZG9jO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU2V0IHRoZSBzbmFwc2hvdCBmb3IgdGhlIGxhc3QgZWxlbWVudCwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIFwic3RhcnRBZnRlclwiIGluIHBhZ2luYXRpb24uXHJcbiAgICBsZXQgcGFnaW5hdGlvblRva2VuID0gbGFzdFNuYXBzaG90O1xyXG5cclxuICAgIC8vIFJldHVybiB0aGUgcmVzdWx0LlxyXG4gICAgcmV0dXJuIHsgcmVzdWx0OiBlbnRpdGllcywgcGFnaW5hdGlvblRva2VuIH07XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgcHVibGljIGFzeW5jIHVwc2VydEFzeW5jKGl0ZW06IFQpIHtcclxuICAgIGNvbnN0IGRvY1JlZiA9IGF3YWl0IGZpcnN0VmFsdWVGcm9tKHRoaXMuZ2V0RG9jdW1lbnRSZWZlcmVuY2UoaXRlbS5pZCkpO1xyXG5cclxuXHJcbiAgICAvLyBUcnkgdG8gZ2V0IHRoZSBpdGVtIGlmIGlkIG5vdCBudWxsXHJcbiAgICBpZiAoaXRlbS5pZCkge1xyXG4gICAgICBpdGVtLmxhc3RNb2RpZmljYXRpb25EYXRlID0gbmV3IERhdGU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaXRlbS5pZCA9IGRvY1JlZi5pZDtcclxuICAgICAgaXRlbS5vd25lciA9IHRoaXMub3duZXI7XHJcbiAgICAgIGl0ZW0ub3duZXJJZCA9IHRoaXMub3duZXJJZDtcclxuICAgICAgaXRlbS5jcmVhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgc2V0RG9jKGRvY1JlZiwgaXRlbSwgeyBtZXJnZTogdHJ1ZSB9KTtcclxuICAgIHJldHVybiBpdGVtO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgYWRkQXN5bmMoaXRlbTogVCkge1xyXG4gICAgLy8gQWRkIGEgbmV3IGRvY3VtZW50IGluIHRoZSBjb2xsZWN0aW9uXHJcbiAgICBpdGVtLm93bmVyID0gdGhpcy5vd25lcjtcclxuICAgIGl0ZW0ub3duZXJJZCA9IHRoaXMub3duZXJJZDtcclxuICAgIGl0ZW0uY3JlYXRpb25EYXRlID0gbmV3IERhdGUoKTtcclxuIFxyXG4gICAgaWYgKGl0ZW0uaWQpIHtcclxuICAgICAgY29uc3QgZG9jUmVmID0gYXdhaXQgZmlyc3RWYWx1ZUZyb20odGhpcy5nZXREb2N1bWVudFJlZmVyZW5jZShpdGVtLmlkKSk7XHJcbiAgICAgIHNldERvYyhkb2NSZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgY29sbGVjdGlvblJlZiA9IGF3YWl0IGZpcnN0VmFsdWVGcm9tKHRoaXMuZ2V0Q29sbGVjdGlvblJlZmVyZW5jZSgpKTtcclxuICAgICAgaXRlbS5pZCA9IChhd2FpdCBhZGREb2MoY29sbGVjdGlvblJlZiwgaXRlbSkpLmlkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGl0ZW07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXJ0aWFsIHVwZGF0ZSBvZiBhIGRvY3VtZW50XHJcbiAgICogQHBhcmFtIGlkXHJcbiAgICogQHBhcmFtIGRhdGFcclxuICAgKi9cclxuICBwdWJsaWMgYXN5bmMgcGFydGlhbFVwZGF0ZShpZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgIGRhdGEubGFzdE1vZGlmaWVkRGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcclxuICAgIC8vIFdlIHJlbW92ZSBhbGwgdW5kZWZpbmVkIGZpZWxkcyB0aGF0IGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGZpcmViYXNlXHJcbiAgICBkYXRhID0gdGhpcy5yZW1vdmVFbXB0eShkYXRhKTtcclxuXHJcbiAgICBjb25zdCBkb2NSZWYgPSBhd2FpdCBmaXJzdFZhbHVlRnJvbSh0aGlzLmdldERvY3VtZW50UmVmZXJlbmNlKGlkKSk7XHJcbiAgICBhd2FpdCB1cGRhdGVEb2MoZG9jUmVmLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBkZWxldGVBc3luYyhpZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBkb2NSZWYgPSBhd2FpdCBmaXJzdFZhbHVlRnJvbSh0aGlzLmdldERvY3VtZW50UmVmZXJlbmNlKGlkKSk7XHJcbiAgICBhd2FpdCBkZWxldGVEb2MoZG9jUmVmKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gKiBSZWN1cnNpdmVseSByZW1vdmVzIHByb3BlcnRpZXMgd2l0aCB1bmRlZmluZWQgdmFsdWVzIGZyb20gYW4gb2JqZWN0IG9yIGFycmF5LlxyXG4gKiBAcGFyYW0gb2JqIC0gVGhlIGlucHV0IG9iamVjdCBvciBhcnJheSB0byBiZSBjbGVhbmVkLlxyXG4gKiBAcmV0dXJucyBBIG5ldyBvYmplY3Qgb3IgYXJyYXkgd2l0aG91dCBwcm9wZXJ0aWVzIG9yIGVsZW1lbnRzIHdpdGggdW5kZWZpbmVkIHZhbHVlcy5cclxuICovXHJcbiAgcHJpdmF0ZSByZW1vdmVFbXB0eSA9IChvYmo6IGFueSk6IGFueSA9PiB7XHJcbiAgICAvLyBDaGVjayBpZiB0aGUgaW5wdXQgaXMgYW4gYXJyYXkgb3IgYW4gb2JqZWN0XHJcbiAgICBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShvYmopO1xyXG4gICAgbGV0IG5ld09iajogYW55ID0gaXNBcnJheSA/IFtdIDoge307XHJcblxyXG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgLy8gSWYgdGhlIHZhbHVlIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSwgcmVjdXJzaXZlbHkgY2xlYW4gaXRcclxuICAgICAgaWYgKG9ialtrZXldID09PSBPYmplY3Qob2JqW2tleV0pKSB7XHJcbiAgICAgICAgbmV3T2JqW2tleV0gPSB0aGlzLnJlbW92ZUVtcHR5KG9ialtrZXldKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBJZiB0aGUgdmFsdWUgaXMgbm90IHVuZGVmaW5lZCwgYWRkIGl0IHRvIHRoZSBuZXcgb2JqZWN0IG9yIGFycmF5XHJcbiAgICAgIGVsc2UgaWYgKG9ialtrZXldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBuZXdPYmpba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBJZiBpdCdzIGFuIGFycmF5LCBmaWx0ZXIgb3V0IGFueSB1bmRlZmluZWQgZWxlbWVudHMgdGhhdCBtaWdodCBoYXZlIGJlZW4gYWRkZWQgZHVyaW5nIHRoZSByZWN1cnNpb25cclxuICAgIGlmIChpc0FycmF5KSB7XHJcbiAgICAgIG5ld09iaiA9IG5ld09iai5maWx0ZXIoKGVsZW1lbnQ6IGFueSkgPT4gZWxlbWVudCAhPT0gdW5kZWZpbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3T2JqO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlcnQgYW55IG9iamVjdCB0byBjb21wYXRpYmxlIEFub255bW91cyBvYmplY3QgZm9yIEZpcmVzdG9yZSBjb21wbGlcclxuICAgKiBAcGFyYW0gb2JqIEFueSBvYmplY3QgdGhhdCBuZWVkcyB0byBiZSBjb252ZXJ0ZWRcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqL1xyXG4gIHByb3RlY3RlZCB0b0Fub255bW91c09iamVjdChvYmo6IGFueSk6IGFueSB7XHJcblxyXG4gICAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFdlIG11c3QgaWdub3JlIHRoZXNlIHR5cGVzIGFzIHRoZXkgY3JlYXRlIGNpcmN1bGFyIGRlcGVuZGVuY2llc1xyXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIERvY3VtZW50UmVmZXJlbmNlIHx8IG9iaiBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xyXG4gICAgICByZXR1cm4gb2JqLm1hcChpdGVtID0+IHRoaXMudG9Bbm9ueW1vdXNPYmplY3QoaXRlbSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgIHJldHVybiBvYmoudG9JU09TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhbm9ueW1vdXNPYmo6IGFueSA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIGFub255bW91c09ialtrZXldID0gdGhpcy50b0Fub255bW91c09iamVjdChvYmpba2V5XSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhbm9ueW1vdXNPYmo7XHJcbiAgfVxyXG59XHJcbiJdfQ==