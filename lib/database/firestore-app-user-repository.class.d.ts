import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { FirestoreRepositoryBase } from './firestore-repository-base.class';
import { AppUser } from '../entities/app-user.class';
/**
 * The FirestoreCompanyRepository holds the Company collection.
 *
 * It redefines toFirestore() method to push the Company using company.id as the Firestore id
 */
export declare class FirestoreAppUserRepository extends FirestoreRepositoryBase<AppUser> {
    constructor(entityConstructor: new () => AppUser, dbPath: Observable<CollectionReference<DocumentData>>, $user: Observable<User | null>);
    /**
     * Override toFirestore to manage FirestoreEntityWatcher for assignedActivities
     * @param doc
     * @returns
     */
    toFirestore(doc: AppUser): any;
}
