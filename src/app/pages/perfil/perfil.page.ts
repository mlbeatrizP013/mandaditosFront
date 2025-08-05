import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
    standalone: false
})
export class PerfilPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
    cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    this.navCtrl.navigateRoot('/login');
  }

}
