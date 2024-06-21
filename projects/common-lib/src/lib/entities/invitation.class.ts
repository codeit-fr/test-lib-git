import { BaseEntity } from "./_base-entity.class";

/**
 * An invitation holds all the needed information to invite a user !
 */
export class Invitation extends BaseEntity {
  public email: string | null = null;
  public displayName: string | null = null;
}

