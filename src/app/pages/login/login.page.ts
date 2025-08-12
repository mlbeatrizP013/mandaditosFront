import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      return this.showAlert('Error', 'Completa email y contraseña');
    }
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        const role = res.role;
        if (role === 'cliente') {
          this.navCtrl.navigateRoot('/main-user');
        } else if (role === 'repartidor') {
          this.navCtrl.navigateRoot('/repartidor');
        } else {
          this.showAlert('Atención', 'Rol no reconocido');
        }
      },
      error: (err) => {
        const msg = err?.error?.message || 'Credenciales inválidas';
        this.showAlert('Error', msg);
      }
    });
  }

  goRegister() {
    this.navCtrl.navigateForward('/register');
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}
