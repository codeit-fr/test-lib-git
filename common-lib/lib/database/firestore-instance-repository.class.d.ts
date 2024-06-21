import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { FirestoreRepositoryBase } from './firestore-repository-base.class';
import { Instance } from '../entities/instance.class';
/**
 * The FirestoreCompanyRepository holds the Company collection.
 *
 * It redefines toFirestore() method to push the Company using company.id as the Firestore id
 */
export declare class FirestoreInstanceRepository<T> extends FirestoreRepositoryBase<Instance<T>> {
    constructor(entityConstructor: new () => Instance<T>, dbPath: Observable<CollectionReference<DocumentData>>, $user: Observable<User | null>);
    /**
     * Override toFirestore to manage FirestoreEntityWatcher for assignedActivities
     * @param doc
     * @returns
     */
    toFirestore(doc: Instance<T>): any;
}
