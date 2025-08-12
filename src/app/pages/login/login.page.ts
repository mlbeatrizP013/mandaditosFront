import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  // Solo login
  email = '';
  password = '';

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {}

  // Ir a la pantalla de registro
  goToRegistro() {
    this.navCtrl.navigateForward('/registro');
  }

  // Inicia sesión contra NestJS
  async login() {
    if (!this.email || !this.password) {
      return this.showAlert('Faltan datos', 'Ingresa correo y contraseña.');
    }

    try {
      await firstValueFrom(this.auth.login(this.email, this.password));

      const role = this.auth.role;
      if (role === 'cliente') {
        this.navCtrl.navigateRoot('/main-user');
      } else if (role === 'repartidor') {
        this.navCtrl.navigateRoot('/repartidor');
      } else {
        // Rol desconocido: regresa al login
        this.navCtrl.navigateRoot('/login');
      }
    } catch (e: any) {
      // Mensaje del backend o genérico
      await this.showAlert(
        'Error',
        e?.error?.message || 'Correo o contraseña incorrectos'
      );
    }
  }

  // Alerta reutilizable
  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
