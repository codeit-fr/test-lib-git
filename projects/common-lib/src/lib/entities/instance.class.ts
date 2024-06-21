import { BaseEntity } from "./_base-entity.class";
import { AppUser } from "./app-user.class";


/**
 * A Company holds all its Users + its general information
 */
export class Instance<T> extends BaseEntity {
    public name!: string;
    public users?: T[] = [];
    public creationProcess?: boolean;
}

