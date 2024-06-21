import * as i0 from '@angular/core';
import { Injectable, Component, Input } from '@angular/core';
import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import { firstValueFrom, ReplaySubject, BehaviorSubject, map, finalize, Observable } from 'rxjs';
import { getAuth, connectAuthEmulator, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import * as i1 from '@angular/common/http';
import * as i2 from '@angular/router';
import { initializeFirestore, connectFirestoreEmulator, doc, getDoc, onSnapshot, or, where, and, orderBy, startAfter, endAt, limit, query, getDocs, setDoc, addDoc, updateDoc, deleteDoc, DocumentReference } from 'firebase/firestore';
import { MatButtonModule } from '@angular/material/button';
import * as i2$1 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i3$1 from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class CommonLibService {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CommonLibService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CommonLibService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CommonLibService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

class CommonLibComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CommonLibComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.4", type: CommonLibComponent, isStandalone: true, selector: "lib-common-lib", ngImport: i0, template: `
    <p>
      common-lib works!
    </p>
  `, isInline: true, styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: CommonLibComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-common-lib', standalone: true, imports: [CommonModule], template: `
    <p>
      common-lib works!
    </p>
  ` }]
        }] });

// WARNING, do not touch the double quote (") chars used in version, commitHash, and installationDate, as it's used by the CI/CD
const envBase = {
    version: "0.1.0.0",
    commitHash: "",
    packageGenerationDate: "",
    stage: '',
    live: false,
    production: false,
    firebase: {
        projectId: 'demo-time-it',
        host: '127.0.0.1:8080',
        firestoreHost: '127.0.0.1:8080',
        ssl: false,
        apiKey: "any-string-value",
        authDomain: 'demo-time-it.any.com',
    }
};

const environmentDevelopment = {
    ...envBase,
    stage: 'dev',
    live: true,
    production: false
};

const environmentProduction = {
    ...envBase,
    stage: 'prod',
    live: true,
    production: true,
    firebase: {
        apiKey: "AIzaSyDj_7nBw_VjvAmv4ClGbSYICBF26c2CgNM",
        authDomain: "time-it-prod.firebaseapp.com",
        projectId: "time-it-prod",
        storageBucket: "time-it-prod.appspot.com",
        messagingSenderId: "876939417541",
        appId: "1:876939417541:web:216f796184014f42d3ddac"
    }
};

const environmentStaging = {
    ...envBase,
    stage: 'uat',
    live: true,
    production: false,
    firebase: {
        projectId: 'time-it-uat',
        storageBucket: '',
        apiKey: 'AIzaSyBBcvi1dgnMbVUU0nSS5RbztZ24CYAhIho',
        authDomain: 'time-it-uat.firebaseapp.com',
        messagingSenderId: '291494207232'
    }
};

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// WARNING, do not touch the double quote (") chars used in version, commitHash, and installationDate, it used by the CI/CD
const environmentLocal = {
    ...envBase,
    stage: 'local',
    live: false,
    production: false,
};

class SystemService {
    constructor(http) {
        this.http = http;
    }
    async getEnvironmentConfiguration() {
        const env = await firstValueFrom(this.http.get('/assets/config.json'));
        const stage = env.stage;
        switch (stage) {
            case 'dev':
                return environmentDevelopment;
            case 'prod':
                return environmentProduction;
            case 'uat':
                return environmentStaging;
            default:
                return environmentLocal;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: SystemService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: SystemService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: SystemService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });

const LOGIN_ROUTE = "/home/login";
/**
 * A service to manage authentication
 */
class AuthenticationService {
    /**
     * constructor
     */
    constructor(systemService, router, route, location) {
        this.systemService = systemService;
        this.router = router;
        this.route = route;
        this.location = location;
        this.currentUser$ = new ReplaySubject(1);
        this.isLoggedIn = new ReplaySubject(1);
        // the port used when emulating Firebase auth service (only in local environment)
        this.firebaseAuthEmulatorPort = 9099;
        this.auth = getAuth();
        const configuration = this.systemService.getEnvironmentConfiguration().then((configuration) => {
            // in Local, we use Firebase emulator
            if (configuration.stage == 'local') {
                connectAuthEmulator(this.auth, `http://localhost:${this.firebaseAuthEmulatorPort}`, { disableWarnings: true });
            }
        });
        // register to Firebase auth user-state updates
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                this.onSignIn(user);
            }
            else {
                await this.onSignOut();
            }
        });
    }
    /**
     * Called when a user signs in
     */
    onSignIn(user) {
        this.currentUser$.next(user);
        this.isLoggedIn.next(true);
    }
    async onSignOut() {
        this.isLoggedIn.next(false);
        this.currentUser$.next(null);
        this.navigateToLogin();
    }
    /**
     * Sign in on Firebase for the given user/password
     * @param email
     * @param password
     * @returns
     */
    async login(email, password) {
        let credentials = null;
        try {
            credentials = await signInWithEmailAndPassword(this.auth, email, password);
        }
        catch (error) {
            throw new Error(`Could not sign-in user with email: ${email}`);
        }
        let user = credentials?.user;
        if (user == null) {
            throw new Error(`Could not sign-in user with email: ${email}`);
        }
        return credentials.user;
    }
    /**
     * Login with google
     * @returns
     */
    async loginWithGoogleAsync() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        let result = await signInWithPopup(auth, provider);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential == null) {
            throw ("Could not get credentials");
        }
        return result.user;
    }
    /**
     * Call on logout
     */
    async logout() {
        const auth = getAuth();
        await signOut(auth);
    }
    /**
     * Navigate to login page
     */
    navigateToLogin() {
        // Skip the action if already on the login page !
        const pathWithoutQuery = this.router.url.split('?')[0];
        if (pathWithoutQuery.endsWith('/login') || pathWithoutQuery.endsWith('/signup') || pathWithoutQuery.endsWith('/not-found') || pathWithoutQuery.endsWith('/invitation')) {
            return;
        }
        this.route.queryParams.subscribe(params => {
            let redirectUrl = document.querySelector('base')?.getAttribute('href') || '/';
            redirectUrl += this.location.path();
            if (params['redirectUrl']) {
                redirectUrl = params['redirectUrl'];
            }
            window.location.href = LOGIN_ROUTE + '?redirectUrl=' + redirectUrl;
        });
    }
    async signup(email, password) {
        let credentials = null;
        try {
            credentials = await createUserWithEmailAndPassword(this.auth, email, password);
        }
        catch (error) {
            throw new Error(`Could not sign-up user with email: ${email}, ${error.message}`);
        }
        let user = credentials?.user;
        if (user == null) {
            throw new Error(`Could not sign-up user with email: ${email}`);
        }
        return credentials.user;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: AuthenticationService, deps: [{ token: SystemService }, { token: i2.Router }, { token: i2.ActivatedRoute }, { token: i3.Location }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: AuthenticationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: AuthenticationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: SystemService }, { type: i2.Router }, { type: i2.ActivatedRoute }, { type: i3.Location }] });

class FirestoreService {
    constructor(systemService) {
        this.systemService = systemService;
        // the port used when emulating Firestore service (only in local environment)
        this.firestoreEmulatorPort = 8080;
    }
    async init(app) {
        // Initialize Cloud Firestore and get a reference to the service
        const configuration = await this.systemService.getEnvironmentConfiguration();
        this.db = initializeFirestore(app, {
            experimentalAutoDetectLongPolling: true
        });
        // in Local, we use Firestore emulator
        if (configuration.stage === 'local') {
            connectFirestoreEmulator(this.db, 'localhost', this.firestoreEmulatorPort);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: FirestoreService, deps: [{ token: SystemService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: FirestoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: FirestoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: SystemService }] });

class InstanceService {
    set instanceId(company) {
        this._instanceId$.next(company);
    }
    get instanceId$() {
        return this._instanceId$.asObservable();
    }
    constructor() {
        /**
         * Observable on the current instance name
         */
        this._instanceId$ = new BehaviorSubject(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: InstanceService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: InstanceService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: InstanceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

var ApplicationsEnum;
(function (ApplicationsEnum) {
    ApplicationsEnum["TimeIt"] = "time-it";
    ApplicationsEnum["Ticketing"] = "ticketing";
})(ApplicationsEnum || (ApplicationsEnum = {}));

/**
 * Class used to filter request on Firestore collections
 */
class Filter {
    constructor(fieldPath, opStr, value) {
        this.fieldPath = fieldPath;
        this.opStr = opStr;
        this.value = value;
    }
}
/**
 * Class used to order the request' results
 */
class Ordering {
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
class FirestoreRepositoryBase {
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

/**
 * This class is used to link a BaseEntity to its Observable and its Firestore DocumentReference
 */
class FirestoreEntityWatcher {
    constructor(observable = null, documentRef) {
        this.observable = null;
        this.documentRef = null;
        this.observable = observable;
        this.documentRef = documentRef;
    }
}

/**
 * The FirestoreCompanyRepository holds the Company collection.
 *
 * It redefines toFirestore() method to push the Company using company.id as the Firestore id
 */
class FirestoreAppUserRepository extends FirestoreRepositoryBase {
    constructor(entityConstructor, dbPath, $user) {
        super(entityConstructor, dbPath, $user);
    }
    /**
     * Override toFirestore to manage FirestoreEntityWatcher for assignedActivities
     * @param doc
     * @returns
     */
    toFirestore(doc) {
        let ret = this.toAnonymousObject(doc);
        delete ret.documentReference;
        return ret;
    }
}

/**
 * The FirestoreCompanyRepository holds the Company collection.
 *
 * It redefines toFirestore() method to push the Company using company.id as the Firestore id
 */
class FirestoreInstanceRepository extends FirestoreRepositoryBase {
    constructor(entityConstructor, dbPath, $user) {
        super(entityConstructor, dbPath, $user);
    }
    /**
     * Override toFirestore to manage FirestoreEntityWatcher for assignedActivities
     * @param doc
     * @returns
     */
    toFirestore(doc) {
        let ret = this.toAnonymousObject(doc);
        delete ret.documentReference;
        return ret;
    }
}

/**
 * Super-class of all Entities.
 * Also used in FirestoreRepositoryBase<T> to link BO entities with DB
 */
class BaseEntity {
    constructor() {
        this.id = null;
        this.creationDate = new Date();
        this.lastModificationDate = new Date();
        this.owner = '';
        this.ownerId = '';
        // Firestore reference
        this.documentReference = null;
    }
    // needed in Firestore to test for equality
    equals(documentReferencePath) {
        return this.documentReference?.path === documentReferencePath;
    }
    /**
     * Override to return a good stringified value
     */
    toString() {
        return this.id ?? "Unknown";
    }
}

class AppUser extends BaseEntity {
    constructor(uid = null, displayName = null, email = null) {
        super();
        this.displayName = '';
        this.email = '';
        this.subscriptions = [];
        this.displayName = displayName ?? '';
        this.email = email;
        this.id = uid; // set id to uid, to use the uid as entity id
    }
}
class AppUserSubscription {
    constructor(applicationName, instanceName, instanceId) {
        this.applicationName = applicationName;
        this.instanceName = instanceName;
        this.instanceId = instanceId;
    }
}

/**
 * A Company holds all its Users + its general information
 */
class Instance extends BaseEntity {
    constructor() {
        super(...arguments);
        this.users = [];
    }
}

class Application extends BaseEntity {
    constructor() {
        super(...arguments);
        this.name = '';
    }
}

/**
 * An invitation holds all the needed information to invite a user !
 */
class Invitation extends BaseEntity {
    constructor() {
        super(...arguments);
        this.email = null;
        this.displayName = null;
    }
}

class NotFoundPageComponent {
    constructor(router, route) {
        this.router = router;
        this.route = route;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: NotFoundPageComponent, deps: [{ token: i2.Router }, { token: i2.ActivatedRoute }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.4", type: NotFoundPageComponent, isStandalone: true, selector: "app-not-found-page", ngImport: i0, template: "<div class=\"center-container\">\r\n  <mat-card appearance=\"outlined\" class=\"card\">\r\n    <div class=\"card-content\">\r\n      <mat-icon>warning</mat-icon>\r\n      <h1>Not Found</h1>\r\n      <p>This page does not exist</p>\r\n    </div>\r\n  </mat-card>\r\n</div>", styles: [".center-container{display:flex;align-items:center;justify-content:center;height:calc(100vh - 56px)}.card{width:650px;padding:60px;background-color:#1f2224;text-align:center}.card mat-icon{font-size:100px;width:100px;height:100px}.card h1{padding:20px 0}.card button{margin-top:30px;padding:20px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2$1.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "ngmodule", type: MatCardModule }, { kind: "component", type: i3$1.MatCard, selector: "mat-card", inputs: ["appearance"], exportAs: ["matCard"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: NotFoundPageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-not-found-page', standalone: true, imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule], template: "<div class=\"center-container\">\r\n  <mat-card appearance=\"outlined\" class=\"card\">\r\n    <div class=\"card-content\">\r\n      <mat-icon>warning</mat-icon>\r\n      <h1>Not Found</h1>\r\n      <p>This page does not exist</p>\r\n    </div>\r\n  </mat-card>\r\n</div>", styles: [".center-container{display:flex;align-items:center;justify-content:center;height:calc(100vh - 56px)}.card{width:650px;padding:60px;background-color:#1f2224;text-align:center}.card mat-icon{font-size:100px;width:100px;height:100px}.card h1{padding:20px 0}.card button{margin-top:30px;padding:20px}\n"] }]
        }], ctorParameters: () => [{ type: i2.Router }, { type: i2.ActivatedRoute }] });

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    ...envBase
};

class VersionComponent {
    constructor() {
        this.title = null;
        this.version = null;
        this.commitHash = null;
        this.packageGenerationDate = null;
        this.version = environment.version;
        this.commitHash = environment.commitHash;
        this.packageGenerationDate = environment.packageGenerationDate;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: VersionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.4", type: VersionComponent, isStandalone: true, selector: "app-version", inputs: { title: "title", version: "version", commitHash: "commitHash", packageGenerationDate: "packageGenerationDate" }, ngImport: i0, template: "<div>\r\n  <h2 class=\"version-title\">{{title}}</h2>\r\n  @if (version) {\r\n    <div class=\"version-part-container\">\r\n      <div class=\"version-part\">\r\n        <span class=\"version-part-name\">version</span>\r\n        <span class=\"version-number\">{{ version }}</span>\r\n      </div>\r\n      <div class=\"version-part\">\r\n        <span class=\"version-part-name\">commitHash</span>\r\n        <span class=\"version-number\">{{ commitHash }}</span>\r\n      </div>\r\n      <div class=\"version-part\">\r\n        <span class=\"version-part-name\">packageGenerationDate</span>\r\n        <span class=\"version-number\">{{ packageGenerationDate }}</span>\r\n      </div>\r\n    </div>\r\n  } @else {\r\n    <div class=\"no-data-container\">\r\n      No data available\r\n    </div>\r\n  }\r\n</div>\r\n", styles: [":host{display:flex;flex-direction:column;height:100%;align-items:center;justify-content:center}.version-title{text-transform:uppercase;text-align:left;color:#fff;border-bottom:1px solid #E73E3E;padding-bottom:10px;font-size:2em;font-family:manrope-regular,sans-serif}.version-part-container{display:flex;flex-direction:column;gap:10px}@media (max-width: 650px){.version-part-container{gap:20px}}.version-part{display:flex;flex-direction:row;gap:20px}@media (max-width: 650px){.version-part{flex-direction:column;gap:5px}}.version-part-name{min-width:250px;color:#6f767e;font-family:manrope-regular,sans-serif;font-size:.9rem;text-transform:uppercase}.version-number{min-width:200px;color:#fff;font-family:manrope-regular,sans-serif;font-size:1.1rem}.no-data-container{display:flex;justify-content:center}\n"], dependencies: [{ kind: "ngmodule", type: MatProgressSpinnerModule }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.4", ngImport: i0, type: VersionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-version', imports: [MatProgressSpinnerModule], standalone: true, template: "<div>\r\n  <h2 class=\"version-title\">{{title}}</h2>\r\n  @if (version) {\r\n    <div class=\"version-part-container\">\r\n      <div class=\"version-part\">\r\n        <span class=\"version-part-name\">version</span>\r\n        <span class=\"version-number\">{{ version }}</span>\r\n      </div>\r\n      <div class=\"version-part\">\r\n        <span class=\"version-part-name\">commitHash</span>\r\n        <span class=\"version-number\">{{ commitHash }}</span>\r\n      </div>\r\n      <div class=\"version-part\">\r\n        <span class=\"version-part-name\">packageGenerationDate</span>\r\n        <span class=\"version-number\">{{ packageGenerationDate }}</span>\r\n      </div>\r\n    </div>\r\n  } @else {\r\n    <div class=\"no-data-container\">\r\n      No data available\r\n    </div>\r\n  }\r\n</div>\r\n", styles: [":host{display:flex;flex-direction:column;height:100%;align-items:center;justify-content:center}.version-title{text-transform:uppercase;text-align:left;color:#fff;border-bottom:1px solid #E73E3E;padding-bottom:10px;font-size:2em;font-family:manrope-regular,sans-serif}.version-part-container{display:flex;flex-direction:column;gap:10px}@media (max-width: 650px){.version-part-container{gap:20px}}.version-part{display:flex;flex-direction:row;gap:20px}@media (max-width: 650px){.version-part{flex-direction:column;gap:5px}}.version-part-name{min-width:250px;color:#6f767e;font-family:manrope-regular,sans-serif;font-size:.9rem;text-transform:uppercase}.version-number{min-width:200px;color:#fff;font-family:manrope-regular,sans-serif;font-size:1.1rem}.no-data-container{display:flex;justify-content:center}\n"] }]
        }], ctorParameters: () => [], propDecorators: { title: [{
                type: Input
            }], version: [{
                type: Input
            }], commitHash: [{
                type: Input
            }], packageGenerationDate: [{
                type: Input
            }] } });

/*
 * Public API Surface of common-lib
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppUser, AppUserSubscription, Application, ApplicationsEnum, AuthenticationService, BaseEntity, CommonLibComponent, CommonLibService, Filter, FirestoreAppUserRepository, FirestoreEntityWatcher, FirestoreInstanceRepository, FirestoreRepositoryBase, FirestoreService, Instance, InstanceService, Invitation, NotFoundPageComponent, Ordering, SystemService, VersionComponent };
//# sourceMappingURL=common-lib.mjs.map
