import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService, RegisterClientePayload, RegisterRepartidorPayload } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  role: 'cliente' | 'repartidor' | '' = '';
  nombre = '';
  telefono = '';
  correo = '';
  password = '';
  confirmPassword = '';
  placa = '';

  dir = {
    calle: '',
    num_casa: null as unknown as number,
    CP: null as unknown as number,
    colonia: '',
    municipio: '',
    estado: '',
    alias: '',
    referencia: ''
  };

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {}

  goLogin() {
    this.navCtrl.navigateBack('/login');
  }

  async onSubmit() {
    if (!this.role) return this.alert('Error', 'Selecciona tu rol.');
    if (!this.nombre || !this.telefono || !this.correo || !this.password) {
      return this.alert('Error', 'Completa todos los campos obligatorios.');
    }
    if (this.password !== this.confirmPassword) {
      return this.alert('Error', 'Las contraseñas no coinciden.');
    }

    if (this.role === 'repartidor') {
      if (!this.placa) return this.alert('Error', 'La placa es obligatoria para repartidor.');
      const payload: RegisterRepartidorPayload = {
        role: 'repartidor',
        nombre: this.nombre,
        telefono: this.telefono,
        correo: this.correo,
        password: this.password,
        placa: this.placa
      };
      this.auth.registerRepartidor(payload).subscribe({
        next: async () => {
          await this.alert('Registro exitoso', 'Tu cuenta de repartidor ha sido creada.');
          this.navCtrl.navigateRoot('/login');
        },
        error: (err) => this.alert('Error', err?.error?.message || 'No se pudo registrar.')
      });
      return;
    }

    // role === 'cliente'
    // Validar dirección
    const requiredDir = ['calle','num_casa','CP','colonia','municipio','estado'] as const;
    for (const k of requiredDir) {
      if (!this.dir[k] && this.dir[k] !== 0) {
        return this.alert('Error', `Falta ${k} en la dirección.`);
      }
    }

    const regCliente: RegisterClientePayload = {
      role: 'cliente',
      nombre: this.nombre,
      telefono: this.telefono,
      correo: this.correo,
      password: this.password
    };

    // Flujo: register -> login -> crear direccion (clienteId = perfil.id)
    this.auth.registerClienteConDireccion(regCliente, this.dir as any).subscribe({
      next: async () => {
        await this.alert('Registro exitoso', 'Tu cuenta y dirección han sido creadas.');
        this.navCtrl.navigateRoot('/login');
      },
      error: (err) => this.alert('Error', err?.error?.message || 'No se pudo registrar.')
    });
  }

  private async alert(header: string, message: string) {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }
}
