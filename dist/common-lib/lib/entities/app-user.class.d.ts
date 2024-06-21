import { BaseEntity } from "./_base-entity.class";
export declare class AppUser extends BaseEntity {
    displayName: string;
    email: string;
    subscriptions: AppUserSubscription[];
    constructor(uid?: string | null, displayName?: string | null, email?: string | null);
}
export declare class AppUserSubscription {
    constructor(applicationName?: string | null, instanceName?: string | null, instanceId?: string | null);
    applicationName?: string | null;
    instanceName?: string | null;
    instanceId?: string | null;
}
