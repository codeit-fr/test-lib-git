import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { User } from 'firebase/auth';
import { FirestoreRepositoryBase } from './firestore-repository-base.class';
import { AppUser } from '../entities/app-user.class';

/**
 * The FirestoreCompanyRepository holds the Company collection.
 *
 * It redefines toFirestore() method to push the Company using company.id as the Firestore id
 */
export class FirestoreAppUserRepository extends FirestoreRepositoryBase<AppUser> {

  public constructor(entityConstructor: new () => AppUser, dbPath: Observable<CollectionReference<DocumentData>>, $user: Observable<User | null>) {
    super(entityConstructor, dbPath, $user);
  }

  /**
   * Override toFirestore to manage FirestoreEntityWatcher for assignedActivities
   * @param doc
   * @returns
   */
  public override toFirestore(doc: AppUser) {
    let ret: any = this.toAnonymousObject(doc);
    delete ret.documentReference;

    return ret;
  }

}
