import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { DireccionPayload } from '../../services/auth.service'; // si lo exportaste
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CategoriasService, Categoria } from '../../services/categorias.service';

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
  styleUrls: ['./main-user.page.scss'],
  standalone: false
})
export class MainUserPage implements OnInit {


  ngOnInit(): void {
    console.log('[MainUser] ngOnInit');
    this.cargarCategorias();
    this.cargarDirecciones();
    this.cargarPedidosCliente();
  }

  mostrarFormulario = false;
  currentTab: 'entregados' | 'enProceso' = 'enProceso';

  // selección para crear pedido
  categorias: Categoria[] = [];
  direcciones: any[] = [];
  categoriaId: number | null = null;
  entregaId: number | null = null;
  recoleccionId: number | null = null;
  precio = 0;
  notas = '';

  // listados
  pedidosEnProceso: any[] = [];
  pedidosEntregados: any[] = [];

  constructor(
    private auth: AuthService,
    private pedidos: PedidoService,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private categoriasSvc: CategoriasService,
    private cdr: ChangeDetectorRef

  ) { }

  ionViewWillEnter() {
    console.log('[MainUser] ionViewWillEnter');
    this.cargarCategorias();
    this.cargarDirecciones();
    this.cargarPedidosCliente();
  }

  changeTab(tab: 'entregados' | 'enProceso') {
    this.currentTab = tab;
  }

  private cargarCategorias() {
  this.categoriasSvc.getAll().subscribe({
    next: (cats: any[]) => {
      console.log('[MainUser] categorias =>', cats);
      this.categorias = (cats ?? []).map(c => ({
        id: +c.id,
        // toma cualquiera de los nombres que vengan
        nombre: c.nombre ?? c.nombre_categoria ?? 'Sin nombre',
        descripcion: c.descripcion ?? c.descripcion_categoria ?? ''
      }));
      // Si usas OnPush, podrías forzar CD:
      // this.cdr.detectChanges();
    },
    error: err => {
      console.error('[MainUser] Error al cargar categorías', err);
      this.categorias = [];
    }
  });
}


  private cargarDirecciones() {
    const clienteId = this.auth.currentPerfilId!;
    this.http.get<any>(`${environment.apiBase}/clientes/${clienteId}`, { headers: this.auth.authHeaders })
      .subscribe({
        next: res => {
          // res.direcciones viene del backend
          this.direcciones = Array.isArray(res?.direcciones) ? res.direcciones : [];
        },
        error: err => {
          console.warn('[MainUser] No se pudieron cargar direcciones:', err);
          this.direcciones = [];
        }
      });
  }

  private cargarPedidosCliente() {
    const clienteId = this.auth.currentPerfilId!;
    this.http.get<any>(`${environment.apiBase}/clientes/${clienteId}`, { headers: this.auth.authHeaders })
      .subscribe({
        next: res => {
          const lista = Array.isArray(res?.pedidos) ? res.pedidos : [];
          this.pedidosEnProceso = [];
          this.pedidosEntregados = [];
          for (const p of lista) {
            const ultimo = Array.isArray(p.historial) && p.historial.length
              ? p.historial[p.historial.length - 1]?.estatus
              : 'En espera';
            if (ultimo === 'Entregado') this.pedidosEntregados.push(p);
            else this.pedidosEnProceso.push(p);
          }
        },
        error: err => {
          console.warn('[MainUser] No se pudieron cargar pedidos:', err);
          this.pedidosEnProceso = [];
          this.pedidosEntregados = [];
        }
      });
  }



  async enviarSolicitud() {
    const clienteId = this.auth.currentPerfilId!;
    if (!this.categoriaId || !this.entregaId || !this.recoleccionId) {
      return this.alert('Error', 'Selecciona categoría y direcciones de recolección y entrega.');
    }
    const eta = new Date();
    eta.setMinutes(eta.getMinutes() + 45); // estimado simple

    this.pedidos.crearPedido({
      categoria: +this.categoriaId,
      lugar_entrega: +this.entregaId,
      lugar_recoleccion: +this.recoleccionId,
      precio: +this.precio,
      notas: this.notas || undefined,
      fecha_entrega_estimada: eta.toISOString(),
      cliente: +clienteId
    }).subscribe({
      next: _ => {
        this.alert('Listo', 'Tu pedido fue creado y está En espera.');
        this.mostrarFormulario = false;
        this.cargarPedidosCliente();
      },
      error: (e) => this.alert('Error', e?.error?.message || 'No se pudo crear el pedido.')
    });
  }

  private async alert(header: string, message: string) {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }
}
