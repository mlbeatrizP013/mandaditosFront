// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';

export type Rol = 'cliente' | 'repartidor';

export interface LoginResponse {
  access_token: string;
  role?: Rol;
  user?: { id: string | number; email: string; role?: Rol };
}

// --- Payloads de registro ---
export interface RegistroClientePayload {
  nombre: string;
  telefono: string;
  correo: string;
  password: string;
  direccion: {
    calle: string;
    num_casa: string;
    CP: string;
    colonia: string;
    municipio: string;
    estado: string;
    alias?: string;
    referencia?: string;
  };
}

export interface RegistroRepartidorPayload {
  nombre: string;
  telefono: string;
  correo: string;
  placa: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.API_URL; // ej: http://localhost:3000/api
  private storageKey = 'usuarioActivo';

  constructor(private http: HttpClient) {}

  // ====== LOGIN (fix rápido) ======
  login(email: string, password: string): Observable<LoginResponse> {
    const normalize = (res: any, role: Rol): LoginResponse => {
      const token =
        res?.access_token ?? res?.token ?? res?.jwt ?? res?.accessToken ?? '';
      const user =
        res?.user ?? res?.cliente ?? res?.repartidor ?? { email };
      return { access_token: token, role, user };
    };

    const tryLogin = (url: string, body: any, role: Rol) =>
      this.http.post<any>(url, body).pipe(map((r) => normalize(r, role)));

    const cURL = `${this.base}/clientes/login`;
    const rURL = `${this.base}/repartidor/login`;

    // 1) clientes con 'correo' -> 2) clientes con 'email'
    // 3) repartidor con 'correo' -> 4) repartid  or con 'email'
    return tryLogin(cURL, { correo: email, password }, 'cliente').pipe(
      catchError(() => tryLogin(cURL, { email, password }, 'cliente')),
      catchError(() => tryLogin(rURL, { correo: email, password }, 'repartidor')),
      catchError((err) => tryLogin(rURL, { email, password }, 'repartidor')),
      tap((res) => this.saveSession(res))
    );
  }

  // ====== REGISTRO CLIENTE (2 pasos: cliente -> dirección) ======
  registerCliente(payload: RegistroClientePayload) {
    const bodyCliente = {
      nombre: payload.nombre,
      telefono: payload.telefono,
      correo: payload.correo,
      password: payload.password,
    };

    return this.http
      .post<{ id: number }>(`${this.base}/clientes`, bodyCliente)
      .pipe(
        switchMap((res: any) => {
          const idCliente = Number(res?.id ?? res?.insertId);
          const bodyDireccion: any = {
            calle: payload.direccion.calle,
            num_casa: Number(payload.direccion.num_casa),
            CP: Number(payload.direccion.CP),
            colonia: payload.direccion.colonia,
            municipio: payload.direccion.municipio,
            estado: payload.direccion.estado,
            clienteId: idCliente,
          };
          if (payload.direccion.alias?.trim())
            bodyDireccion.alias = payload.direccion.alias.trim();
          if (payload.direccion.referencia?.trim())
            bodyDireccion.referencia = payload.direccion.referencia.trim();

          return this.http.post(`${this.base}/direccion`, bodyDireccion);
        })
      );
  }

  // ====== REGISTRO REPARTIDOR ======
  registerRepartidor(payload: RegistroRepartidorPayload): Observable<any> {
    return this.http.post(`${this.base}/repartidor`, payload);
  }

  // ====== Helpers de sesión ======
  private saveSession(res: LoginResponse) {
    const role: Rol | null =
      (res.user?.role as Rol) ?? (res.role as Rol) ?? null;
    const session = { ...res, roleResolved: role };
    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  get usuarioActivo(): (LoginResponse & { roleResolved?: Rol }) | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw
      ? (JSON.parse(raw) as LoginResponse & { roleResolved?: Rol })
      : null;
  }

  get token(): string | null {
    return this.usuarioActivo?.access_token ?? null;
  }

  get role(): Rol | null {
    return (
      (this.usuarioActivo as any)?.roleResolved ??
      this.usuarioActivo?.user?.role ??
      (this.usuarioActivo?.role as Rol) ??
      null
    );
  }

  isLogged(): boolean {
    return !!this.token;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
  }

  authHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: this.token ? `Bearer ${this.token}` : '',
      }),
    };
  }
}
