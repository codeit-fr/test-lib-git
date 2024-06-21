import { BaseEntity } from "./_base-entity.class";

export class AppUser extends BaseEntity {

  public displayName: string = '';
  public email: string = '';
  public subscriptions: AppUserSubscription[] = [];

  constructor(uid: string | null = null, displayName: string | null = null, email: string | null = null) {
    super();
    this.displayName = displayName! ?? '';
    this.email = email!;
    this.id = uid; // set id to uid, to use the uid as entity id
  }
}

export class AppUserSubscription {
  constructor(applicationName?: string | null, instanceName?: string | null, instanceId?: string | null) {
    this.applicationName = applicationName;
    this.instanceName = instanceName;
    this.instanceId = instanceId;
  }
  applicationName?: string | null;
  instanceName?: string | null;
  instanceId?: string | null;
}