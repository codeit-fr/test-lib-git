import { FirestoreRepositoryBase } from './firestore-repository-base.class';
/**
 * The FirestoreCompanyRepository holds the Company collection.
 *
 * It redefines toFirestore() method to push the Company using company.id as the Firestore id
 */
export class FirestoreInstanceRepository extends FirestoreRepositoryBase {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZXN0b3JlLWluc3RhbmNlLXJlcG9zaXRvcnkuY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21tb24tbGliL3NyYy9saWIvZGF0YWJhc2UvZmlyZXN0b3JlLWluc3RhbmNlLXJlcG9zaXRvcnkuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHNUU7Ozs7R0FJRztBQUNILE1BQU0sT0FBTywyQkFBK0IsU0FBUSx1QkFBb0M7SUFFdEYsWUFBbUIsaUJBQXdDLEVBQUUsTUFBcUQsRUFBRSxLQUE4QjtRQUNoSixLQUFLLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ2EsV0FBVyxDQUFDLEdBQWdCO1FBQzFDLElBQUksR0FBRyxHQUFRLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUzQyxPQUFPLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztRQUU3QixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Q0FFRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbGxlY3Rpb25SZWZlcmVuY2UsIERvY3VtZW50RGF0YSB9IGZyb20gJ2ZpcmViYXNlL2ZpcmVzdG9yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJ2ZpcmViYXNlL2F1dGgnO1xyXG5pbXBvcnQgeyBGaXJlc3RvcmVSZXBvc2l0b3J5QmFzZSB9IGZyb20gJy4vZmlyZXN0b3JlLXJlcG9zaXRvcnktYmFzZS5jbGFzcyc7XHJcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vZW50aXRpZXMvaW5zdGFuY2UuY2xhc3MnO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBGaXJlc3RvcmVDb21wYW55UmVwb3NpdG9yeSBob2xkcyB0aGUgQ29tcGFueSBjb2xsZWN0aW9uLlxyXG4gKlxyXG4gKiBJdCByZWRlZmluZXMgdG9GaXJlc3RvcmUoKSBtZXRob2QgdG8gcHVzaCB0aGUgQ29tcGFueSB1c2luZyBjb21wYW55LmlkIGFzIHRoZSBGaXJlc3RvcmUgaWRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBGaXJlc3RvcmVJbnN0YW5jZVJlcG9zaXRvcnk8VD4gZXh0ZW5kcyBGaXJlc3RvcmVSZXBvc2l0b3J5QmFzZTxJbnN0YW5jZTxUPj4ge1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoZW50aXR5Q29uc3RydWN0b3I6IG5ldyAoKSA9PiBJbnN0YW5jZTxUPiwgZGJQYXRoOiBPYnNlcnZhYmxlPENvbGxlY3Rpb25SZWZlcmVuY2U8RG9jdW1lbnREYXRhPj4sICR1c2VyOiBPYnNlcnZhYmxlPFVzZXIgfCBudWxsPikge1xyXG4gICAgc3VwZXIoZW50aXR5Q29uc3RydWN0b3IsIGRiUGF0aCwgJHVzZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT3ZlcnJpZGUgdG9GaXJlc3RvcmUgdG8gbWFuYWdlIEZpcmVzdG9yZUVudGl0eVdhdGNoZXIgZm9yIGFzc2lnbmVkQWN0aXZpdGllc1xyXG4gICAqIEBwYXJhbSBkb2NcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBvdmVycmlkZSB0b0ZpcmVzdG9yZShkb2M6IEluc3RhbmNlPFQ+KSB7XHJcbiAgICBsZXQgcmV0OiBhbnkgPSB0aGlzLnRvQW5vbnltb3VzT2JqZWN0KGRvYyk7XHJcblxyXG4gICAgZGVsZXRlIHJldC5kb2N1bWVudFJlZmVyZW5jZTtcclxuXHJcbiAgICByZXR1cm4gcmV0O1xyXG4gIH1cclxuXHJcbn1cclxuIl19