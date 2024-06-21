import { BaseEntity } from "./_base-entity.class";
/**
 * A Company holds all its Users + its general information
 */
export declare class Instance<T> extends BaseEntity {
    name: string;
    users?: T[];
    creationProcess?: boolean;
}
