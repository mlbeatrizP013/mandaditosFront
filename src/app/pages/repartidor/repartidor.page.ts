import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.page.html',
  styleUrls: ['./repartidor.page.scss'],
  standalone: false
})
export class RepartidorPage {
  filtro = '';
  pedidos: any[] = [];
  pedidoActual: any | null = null;

  constructor(
    private pedidosSvc: PedidoService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private socket: SocketService
  ) { }

  ionViewWillEnter() {
    if (!this.auth.isLoggedIn || this.auth.currentRole !== 'repartidor') return;
    this.cargarDisponibles();
    this.cargarEnCurso();

    // Suscripciones socket para refrescar
    this.socket.onNuevoPedido().subscribe(() => this.cargarDisponibles());
    this.socket.onPedidoAceptado().subscribe(() => this.cargarDisponibles());
    this.socket.onPedidoEntregado().subscribe(() => this.cargarDisponibles());
  }

  cargarDisponibles() {
    this.pedidosSvc.pedidosDisponibles().subscribe({
      next: (lista) => this.pedidos = lista,
      error: _ => this.pedidos = []
    });
  }

  cargarEnCurso() {
    const repartidorId = this.auth.currentPerfilId!;
    this.pedidosSvc.pedidosEnCursoRepartidor(repartidorId).subscribe({
      next: lista => {
        // Toma el más reciente si hay varios
        this.pedidoActual = Array.isArray(lista) && lista.length ? lista[0] : null;
      },
      error: _ => this.pedidoActual = null
    });
  }

  pedidosFiltrados() {
    const texto = (this.filtro || '').toLowerCase();
    if (!texto) return this.pedidos;
    return this.pedidos.filter(p =>
      (p?.categoria?.nombre || '').toLowerCase().includes(texto) ||
      (p?.lugar_recoleccion?.colonia || '').toLowerCase().includes(texto) ||
      (p?.lugar_entrega?.colonia || '').toLowerCase().includes(texto)
    );
  }

  async mostrarAlerta(pedido: any) {
    const alert = await this.alertCtrl.create({
      header: 'Detalle del pedido',
      message: `
        <b>Recolectar:</b> ${this.formatDir(pedido.lugar_recoleccion)}<br/>
        <b>Entregar:</b> ${this.formatDir(pedido.lugar_entrega)}<br/>
        <b>Categoría:</b> ${pedido?.categoria?.nombre || '-'}<br/>
        <b>Precio:</b> $${pedido?.precio}
      `,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.aceptar(pedido.id) }
      ],
      cssClass: 'custom-alert',
    });
    await alert.present();
  }

  aceptar(pedidoId: number) {
    const repartidorId = this.auth.currentPerfilId!;
    this.pedidosSvc.aceptarPedido(pedidoId, repartidorId).subscribe({
      next: async _ => {
        await this.alertCtrl.create({
          header: 'Listo',
          message: 'Pedido aceptado',
          buttons: ['OK']
        }).then(a => a.present());
        this.cargarDisponibles();
      },
      error: async (e) => {
        await this.alertCtrl.create({
          header: 'No se pudo aceptar',
          message: e?.error?.message || 'Intenta con otro pedido.',
          buttons: ['OK']
        }).then(a => a.present());
        this.cargarDisponibles();
      }
    });
  }

  iniciarCamino() {
    if (!this.pedidoActual) return;
    this.pedidosSvc.marcarEnCamino(this.pedidoActual.id).subscribe({
      next: _ => this.cargarEnCurso(),
      error: e => console.error(e)
    });
  }

  marcarEntregado() {
    if (!this.pedidoActual) return;
    this.pedidosSvc.marcarEntregado(this.pedidoActual.id).subscribe({
      next: _ => { this.cargarEnCurso(); this.cargarDisponibles(); },
      error: e => console.error(e)
    });
  }

  formatDir(d: any) {
    if (!d) return '-';
    return `${d.calle} #${d.num_casa}, ${d.colonia}, ${d.municipio}`;
  }

  estatusActual(p: any): string {
    const h = p?.historial || [];
    return h.length ? h[h.length - 1]?.estatus : '-';
  }
}
