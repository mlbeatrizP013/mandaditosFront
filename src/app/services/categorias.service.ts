import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private base = environment.apiBase;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAll(): Observable<Categoria[]> {
  const url = `${environment.apiBase}/categorias`;
  console.log('[CategoriasService] GET', url);

  return this.http.get<Categoria[]>(url, { headers: this.auth.authHeaders }).pipe(
    tap(res => console.log('[CategoriasService] OK ->', res)),
    catchError(err => {
      console.error('[CategoriasService] FAIL ->', err);
      return of([] as Categoria[]);
    })
  );
}
}
