import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  connected = false;
  test = false;
  status$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.checkConnection();
    Network.getStatus().then(status => {
      this.connected = status.connected;
      this.status$.next(this.test ? false : status.connected);
    });

    Network.addListener('networkStatusChange', status => {
      this.connected = status.connected;
      this.status$.next(this.test ? false : status.connected);
    });

    /*  if (this.test) {
       setTimeout(() => {
         this.status$.next(true);
       }, 5000);
     } */
  }

  async checkConnection() {
    if (this.test) return false;

    try {
      const status = await Network.getStatus();
      console.log('Network status', status);
      return status.connected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }


}
