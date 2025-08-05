import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.page.html',
  styleUrls: ['./repartidor.page.scss'],
  standalone:false
})
export class RepartidorPage {

  constructor(private navCtrl: NavController) {}

  cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    this.navCtrl.navigateRoot('/login');
  }
}
