import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.page.html',
  styleUrls: ['./repartidor.page.scss'],
  standalone: false
})
export class RepartidorPage {
  filtro: string = '';

  constructor(private navCtrl: NavController,private alertController: AlertController) {}

  // Lista de pedidos simulada
  pedidos = [
    {
      estado: 'Estado del pedido',
      descripcion: 'Mandado 1: Llevar paquete',
      hora: '10:00 AM',
      precio: '$50',
    },
    {
      estado: 'Estado del pedido',
      descripcion: 'Mandado 2: Recoger pizza',
      hora: '11:30 AM',
      precio: '$40',
    },
    {
      estado: 'Estado del pedido',
      descripcion: 'Mandado 3: Llevar documentos',
      hora: '01:00 PM',
      precio: '$60',
    },
  ];

  // Filtrado de pedidos
  pedidosFiltrados() {
    if (!this.filtro || this.filtro.trim() === '') {
      return this.pedidos;
    }

    const texto = this.filtro.toLowerCase();

    return this.pedidos.filter(pedido =>
      pedido.descripcion.toLowerCase().includes(texto) ||
      pedido.estado.toLowerCase().includes(texto) ||
      pedido.hora.toLowerCase().includes(texto) ||
      pedido.precio.toLowerCase().includes(texto)
    );
  }

  // Cerrar sesión
  cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    this.navCtrl.navigateRoot('/login');
  }
    async mostrarAlerta(pedido: any) {
    const alert = await this.alertController.create({
      header: pedido.descripcion,
      subHeader: `Estado: ${pedido.estado}`,
      message: `
        Lugar de recolección:${pedido.lugarRecoleccion}
        Lugar de entrega:${pedido.lugarEntrega}
        Precio: ${pedido.precio}
      `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Pedido aceptado');
          },
        },
      ],
      cssClass: 'custom-alert',
    });

    await alert.present();
  }
}

