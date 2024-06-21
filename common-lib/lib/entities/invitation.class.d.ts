import { BaseEntity } from "./_base-entity.class";
/**
 * An invitation holds all the needed information to invite a user !
 */
export declare class Invitation extends BaseEntity {
    email: string | null;
    displayName: string | null;
}
