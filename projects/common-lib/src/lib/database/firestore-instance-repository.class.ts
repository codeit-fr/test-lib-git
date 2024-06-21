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
export class FirestoreInstanceRepository<T> extends FirestoreRepositoryBase<Instance<T>> {

  public constructor(entityConstructor: new () => Instance<T>, dbPath: Observable<CollectionReference<DocumentData>>, $user: Observable<User | null>) {
    super(entityConstructor, dbPath, $user);
  }

  /**
   * Override toFirestore to manage FirestoreEntityWatcher for assignedActivities
   * @param doc
   * @returns
   */
  public override toFirestore(doc: Instance<T>) {
    let ret: any = this.toAnonymousObject(doc);

    delete ret.documentReference;

    return ret;
  }

}
