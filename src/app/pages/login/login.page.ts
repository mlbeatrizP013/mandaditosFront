import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage {
  isLogin = true;

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  selectedRole: string = '';

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
    this.selectedRole = '';
  }

  async login() {
  const storedUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const user = storedUsers.find((u: any) => u.email === this.email && u.password === this.password);

  if (user) {
    localStorage.setItem('usuarioActivo', JSON.stringify(user));

    await this.showAlert('¡Bienvenido!', `Hola ${user.email}`);

    // Redirigir según rol
    if (user.role === 'cliente') {
      this.navCtrl.navigateRoot('/main-user');
    } else if (user.role === 'repartidor') {
      this.navCtrl.navigateRoot('/repartidor');
    }
  } else {
    await this.showAlert('Error', 'Correo o contraseña incorrectos');
  }
}


  async register() {
    if (this.password !== this.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!this.selectedRole) {
      await this.showAlert('Error', 'Debes seleccionar un rol');
      return;
    }

    let storedUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const emailExists = storedUsers.some((u: any) => u.email === this.email);
    if (emailExists) {
      await this.showAlert('Error', 'Ya existe una cuenta con este correo');
      return;
    }

    const newUser = {
      email: this.email,
      password: this.password,
      role: this.selectedRole // 👈 se guarda el rol
    };

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
