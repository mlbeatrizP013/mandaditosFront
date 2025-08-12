import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiBase /*, { auth: { token: '...'} }*/);
  }

  onNuevoPedido(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('nuevo-pedido', (pedido) => obs.next(pedido));
    });
  }
  onPedidoAceptado(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('pedido-aceptado', (p) => obs.next(p));
    });
  }
  onPedidoEnCamino(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('pedido-en-camino', (p) => obs.next(p));
    });
  }
  onPedidoEntregado(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('pedido-entregado', (p) => obs.next(p));
    });
  }
}
