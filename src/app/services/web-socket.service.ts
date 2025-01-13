import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io,Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  /*private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8080');
  }

  listen(eventName: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }**/
}
