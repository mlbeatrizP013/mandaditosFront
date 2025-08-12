import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map, switchMap } from 'rxjs';

export type Rol = 'cliente' | 'repartidor';

export interface LoginResponse {
  access_token: string;
  role: Rol;
  user: { id: number | string; correo: string };
  perfil: { id: number; nombre: string };
}

export interface RegisterClientePayload {
  role: 'cliente';
  nombre: string;
  telefono: string;
  correo: string;
  password: string;
}

export interface RegisterRepartidorPayload {
  role: 'repartidor';
  nombre: string;
  telefono: string;
  correo: string;
  password: string;
  placa: string;
}

export interface DireccionPayload {
  calle: string;
  num_casa: number;
  CP: number;
  colonia: string;
  municipio: string;
  estado: string;
  alias?: string;
  referencia?: string;
  clienteId: number; // lo llenamos tras login
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;

  // Estado en memoria
  private token: string | null = null;
  private role: Rol | null = null;
  private perfilId: number | null = null;
  private perfilNombre: string | null = null;
  private email: string | null = null;

  constructor(private http: HttpClient) {}

  get authHeaders(): HttpHeaders {
    return this.token
      ? new HttpHeaders({ Authorization: `Bearer ${this.token}` })
      : new HttpHeaders();
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
  get currentRole(): Rol | null { return this.role; }
  get currentPerfilId(): number | null { return this.perfilId; }
  get currentEmail(): string | null { return this.email; }

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { correo, password })
      .pipe(
        map(res => {
          this.token = res.access_token;
          this.role = res.role;
          this.perfilId = res.perfil?.id ?? null;
          this.perfilNombre = res.perfil?.nombre ?? null;
          this.email = res.user?.correo ?? null;
          return res;
        })
      );
  }

  logout(): void {
    this.token = null;
    this.role = null;
    this.perfilId = null;
    this.perfilNombre = null;
    this.email = null;
  }

  registerCliente(payload: RegisterClientePayload) {
    return this.http.post<{message:string}>(`${this.base}/auth/register`, payload);
  }

  registerRepartidor(payload: RegisterRepartidorPayload) {
    return this.http.post<{message:string}>(`${this.base}/auth/register`, payload);
  }

  crearDireccion(direccion: Omit<DireccionPayload, 'clienteId'>, clienteId: number) {
    const body: DireccionPayload = { ...direccion, clienteId };
    return this.http.post(`${this.base}/direccion`, body, { headers: this.authHeaders });
  }

  /**
   * Flujo atómico de registro de cliente:
   * 1) /auth/register (role=cliente)
   * 2) /auth/login para obtener perfil.id
   * 3) /direccion (con clienteId=perfil.id)
   */
  registerClienteConDireccion(
    reg: RegisterClientePayload,
    dir: Omit<DireccionPayload, 'clienteId'>
  ) {
    return this.registerCliente(reg).pipe(
      switchMap(() => this.login(reg.correo, reg.password)),
      switchMap(loginRes => this.crearDireccion(dir, loginRes.perfil.id))
    );
  }
}
