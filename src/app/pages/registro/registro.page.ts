import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

type Role = 'cliente' | 'repartidor';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {
  role: Role = 'cliente';

  cliente = {
    nombre: '',
    telefono: '',
    correo: '',
    password: '',
    confirm: '',
    direccion: {
      calle: '',
      num_casa: '',
      CP: '',
      colonia: '',
      municipio: '',
      estado: '',
      alias: '',
      referencia: ''
    }
  };

  repartidor = {
    nombre: '',
    telefono: '',
    correo: '',
    placa: '',
    password: '',
    confirm: ''
  };

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController,
    private nav: NavController
  ) {}

  async registerCliente() {
    if (this.cliente.password !== this.cliente.confirm) {
      return this.alert('Error', 'Las contraseñas no coinciden');
    }
    try {
      await firstValueFrom(
        this.auth.registerCliente({
          nombre: this.cliente.nombre,
          telefono: this.cliente.telefono,
          correo: this.cliente.correo,
          password: this.cliente.password,
          direccion: { ...this.cliente.direccion } // se crea primero el cliente y luego su dirección
        })
      );
      await this.alert('¡Listo!', 'Cuenta de cliente creada. Ahora inicia sesión.');
      this.nav.navigateBack('/login');
    } catch (e: any) {
      this.alert('Error', e?.error?.message || 'No se pudo registrar al cliente');
    }
  }

  async registerRepartidor() {
    if (this.repartidor.password !== this.repartidor.confirm) {
      return this.alert('Error', 'Las contraseñas no coinciden');
    }
    try {
      await firstValueFrom(
        this.auth.registerRepartidor({
          nombre: this.repartidor.nombre,
          telefono: this.repartidor.telefono,
          correo: this.repartidor.correo,
          placa: this.repartidor.placa,
          password: this.repartidor.password
        })
      );
      await this.alert('¡Listo!', 'Cuenta de repartidor creada. Ahora inicia sesión.');
      this.nav.navigateBack('/login');
    } catch (e: any) {
      this.alert('Error', e?.error?.message || 'No se pudo registrar al repartidor');
    }
  }

  private async alert(header: string, message: string) {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }
}
