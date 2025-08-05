import { Component } from '@angular/core';
import { NavController } from '@ionic/angular'; // 👈 Necesario para redirección

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
  styleUrls: ['./main-user.page.scss'],
  standalone: false
})
export class MainUserPage {

  estado: 'entregados' | 'proceso' = 'proceso';

  pedidosEnProceso = [
    { descripcion: 'Pedido 1', hora: '10:00 AM' },
    { descripcion: 'Pedido 2', hora: '11:00 AM' }
  ];

  pedidosEntregados = [
    { descripcion: 'Pedido entregado 1', hora: '9:00 AM' }
  ];

  constructor(private navCtrl: NavController) {}

  cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    this.navCtrl.navigateRoot('/login');
  }
}
