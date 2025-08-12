import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService, Rol } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
  role: Rol | null = null;
  email: string | null = null;

  // Cliente
  cliente: any = null;
  direcciones: any[] = [];
  nuevaDir = {
    calle: '', num_casa: null as any, CP: null as any,
    colonia: '', municipio: '', estado: '', alias: '', referencia: ''
  };

  // Repartidor
  repartidor: any = null;

  loading = false;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.init();
  }

  ionViewWillEnter() {
    // refresca al entrar
    this.init();
  }

  private init() {
    if (!this.auth.isLoggedIn) {
      this.navCtrl.navigateRoot('/login');
      return;
    }
    this.role = this.auth.currentRole;
    this.email = this.auth.currentEmail;

    const id = this.auth.currentPerfilId!;
    if (this.role === 'cliente') {
      this.cargarCliente(id);
    } else if (this.role === 'repartidor') {
      this.cargarRepartidor(id);
    }
  }

  private cargarCliente(id: number) {
    this.loading = true;
    this.auth.getClienteById(id).subscribe({
      next: (cli) => {
        this.cliente = { id: cli.id, nombre: cli.nombre, telefono: cli.telefono, active: cli.active };
        // relaciones vienen si tu service findOne incluye relations (ya lo hace)
        this.direcciones = Array.isArray(cli.direcciones) ? cli.direcciones : [];
        this.loading = false;
      },
      error: (e) => { this.loading = false; this.alert('Error', this.msg(e)); }
    });
  }

  private cargarRepartidor(id: number) {
    this.loading = true;
    this.auth.getRepartidorById(id).subscribe({
      next: (rep) => {
        this.repartidor = { id: rep.id, nombre: rep.nombre, telefono: rep.telefono, placa: rep.placa, activo: rep.activo };
        this.loading = false;
      },
      error: (e) => { this.loading = false; this.alert('Error', this.msg(e)); }
    });
  }

  guardarPerfil() {
    if (this.role === 'cliente' && this.cliente) {
      const payload: any = { nombre: this.cliente.nombre, telefono: this.cliente.telefono, active: this.cliente.active };
      this.auth.updateCliente(this.cliente.id, payload).subscribe({
        next: () => this.alert('Listo', 'Perfil de cliente actualizado.'),
        error: (e) => this.alert('Error', this.msg(e))
      });
    }
    if (this.role === 'repartidor' && this.repartidor) {
      const payload: any = { nombre: this.repartidor.nombre, telefono: this.repartidor.telefono, placa: this.repartidor.placa, activo: this.repartidor.activo };
      this.auth.updateRepartidor(this.repartidor.id, payload).subscribe({
        next: () => this.alert('Listo', 'Perfil de repartidor actualizado.'),
        error: (e) => this.alert('Error', this.msg(e))
      });
    }
  }

  // ===== Direcciones (solo cliente) =====
  actualizarDireccion(d: any) {
    const payload: any = {
      calle: d.calle, num_casa: +d.num_casa, CP: +d.CP,
      colonia: d.colonia, municipio: d.municipio, estado: d.estado,
      alias: d.alias, referencia: d.referencia
    };
    this.auth.updateDireccion(d.id, payload).subscribe({
      next: () => this.alert('Listo', 'Dirección actualizada.'),
      error: (e) => this.alert('Error', this.msg(e))
    });
  }

  agregarDireccion() {
    const id = this.auth.currentPerfilId!;
    // Validación mínima
    const req = ['calle','num_casa','CP','colonia','municipio','estado'] as const;
    for (const k of req) {
      if (this.nuevaDir[k] === null || this.nuevaDir[k] === '' || this.nuevaDir[k] === undefined) {
        this.alert('Error', `Falta ${k} en la nueva dirección.`);
        return;
      }
    }
    this.auth.createDireccion(id, {
      calle: this.nuevaDir.calle,
      num_casa: +this.nuevaDir.num_casa,
      CP: +this.nuevaDir.CP,
      colonia: this.nuevaDir.colonia,
      municipio: this.nuevaDir.municipio,
      estado: this.nuevaDir.estado,
      alias: this.nuevaDir.alias || undefined,
      referencia: this.nuevaDir.referencia || undefined
    }).subscribe({
      next: () => {
        this.alert('Listo', 'Dirección agregada.');
        // limpiar y recargar
        this.nuevaDir = { calle: '', num_casa: null as any, CP: null as any, colonia: '', municipio: '', estado: '', alias: '', referencia: '' };
        this.cargarCliente(id);
      },
      error: (e) => this.alert('Error', this.msg(e))
    });
  }

  cerrarSesion() {
    this.auth.logout();
    this.navCtrl.navigateRoot('/login');
  }

  // Helpers
  private async alert(header: string, message: string) {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }
  private msg(e: any) {
    return e?.error?.message || e?.message || 'Ocurrió un error';
  }
}
