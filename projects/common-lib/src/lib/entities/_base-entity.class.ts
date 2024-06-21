import { DocumentData, DocumentReference } from "firebase/firestore";

/**
 * Super-class of all Entities.
 * Also used in FirestoreRepositoryBase<T> to link BO entities with DB
 */
export class BaseEntity {
  public id: string | null = null;
  public creationDate?: Date = new Date();
  public lastModificationDate?: Date = new Date();
  public owner?: string = '';
  public ownerId?: string = '';

  // Firestore reference
  public documentReference?: DocumentReference<any> | null = null;

  // needed in Firestore to test for equality
  public equals?(documentReferencePath: string): boolean {
    return this.documentReference?.path === documentReferencePath;
  }

  /**
   * Override to return a good stringified value
   */
  public toString(): string {
    return this.id ?? "Unknown";
  }

}
