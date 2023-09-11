import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  connected = false;

  constructor() {
    this.checkConnection();
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      this.connected = status.connected;
    });
  }

  async checkConnection() {
    // return false;
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
