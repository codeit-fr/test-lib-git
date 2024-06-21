import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxCodeItService {

  constructor() { }
  LogUpdater(params: any) {
    // ...
  }
  
  LogEffect(params: any) {
    // ...
  }
  
  LogObservable(groupMessage: string, observable: Observable<any>, initialState: any) {
   
  }
  
  LogState(params: any) {
    // ...
  }
}
