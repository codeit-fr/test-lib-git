import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {

  /**
   * Observable on the current instance name
   */
  protected _instanceId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  public set instanceId(company: string) {
    this._instanceId$.next(company);
  }

  public get instanceId$(): Observable<string | null> {
    return this._instanceId$.asObservable();
  }

  constructor() { }



}
