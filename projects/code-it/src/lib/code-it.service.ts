import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeItService {

  constructor() { }
  LogUpdater(params: any) {
    console.log('LogUpdater', params);
  }
  
  LogEffect(params: any) {
    console.log('LogEffect', params);
  }
  
  LogObservable(groupMessage: string, observable: Observable<any>, initialState: any) {
    console.log('LogObservable', groupMessage, observable, initialState);
  }
  
  LogState(params: any) {
    console.log('LogState', params);
  }
}
