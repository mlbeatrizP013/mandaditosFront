import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent  {
   isLogin = true;

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.clearForm();
  }

  clearForm() {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  async login() {
    const storedUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = storedUsers.find((u: any) => u.email === this.email && u.password === this.password);

    if (user) {
      await this.showAlert('¡Bienvenido!', `Hola ${user.email}`);
      this.navCtrl.navigateRoot('/tabs/tab1');
    } else {
      await this.showAlert('Error', 'Correo o contraseña incorrectos');
    }
  }

  async register() {
    if (this.password !== this.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    let storedUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const emailExists = storedUsers.some((u: any) => u.email === this.email);
    if (emailExists) {
      await this.showAlert('Error', 'Ya existe una cuenta con este correo');
      return;
    }

    const newUser = { email: this.email, password: this.password };
    storedUsers.push(newUser);
    localStorage.setItem('usuarios', JSON.stringify(storedUsers));

    await this.showAlert('Registro exitoso', 'Ya puedes iniciar sesión');
    this.toggleForm();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
