import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';

export interface PedidoCreatePayload {
  categoria: number;
  lugar_entrega: number;
  lugar_recoleccion: number;
  precio: number;
  notas?: string;
  fecha_entrega_estimada: string; // ISO string
  cliente: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private base = environment.apiBase;

  constructor(private http: HttpClient, private auth: AuthService) {}

  crearPedido(payload: PedidoCreatePayload) {
    return this.http.post(`${this.base}/pedido`, payload, { headers: this.auth.authHeaders });
  }

  pedidosCliente(clienteId: number) {
    return this.http.get<any[]>(`${this.base}/pedido/cliente/${clienteId}`, { headers: this.auth.authHeaders });
  }

  pedidosDisponibles() {
    return this.http.get<any[]>(
      `${environment.apiBase}/pedido/disponibles`,
      { headers: this.auth.authHeaders }
    ).pipe(
      // normaliza nombres por si backend trae nombre_categoria
      map(lista => (lista ?? []).map((p: any) => ({
        ...p,
        categoria: p.categoria
          ? {
              ...p.categoria,
              nombre: p.categoria.nombre ?? p.categoria.nombre_categoria
            }
          : null
      })))
    );
  }

  aceptarPedido(pedidoId: number, repartidorId: number) {
    return this.http.post(
      `${environment.apiBase}/pedido/${pedidoId}/aceptar`,
      { repartidorId },
      { headers: this.auth.authHeaders }
    );
  }

  pedidosEnCursoRepartidor(repartidorId: number) {
    return this.http.get<any[]>(
      `${environment.apiBase}/pedido/repartidor/${repartidorId}/en-curso`,
      { headers: this.auth.authHeaders }
    ).pipe(
      map(lista => (lista ?? []).map((p: any) => ({
        ...p,
        categoria: p.categoria ? { ...p.categoria, nombre: p.categoria.nombre ?? p.categoria.nombre_categoria } : null
      })))
    );
  }

  // >>> NUEVO: cambiar estatus rápido
  marcarEnCamino(pedidoId: number) {
    return this.http.post(
      `${environment.apiBase}/pedido/${pedidoId}/en-camino`,
      {},
      { headers: this.auth.authHeaders }
    );
  }

  marcarEntregado(pedidoId: number) {
    return this.http.post(
      `${environment.apiBase}/pedido/${pedidoId}/entregado`,
      {},
      { headers: this.auth.authHeaders }
    );
  }

  actualizarEstatus(pedidoId: number, estatus: 'En espera'|'Aceptado'|'En camino'|'Entregado', comentario?: string) {
    return this.http.patch(`${this.base}/pedido/${pedidoId}/estatus`, { estatus, comentario }, { headers: this.auth.authHeaders });
  }
}
