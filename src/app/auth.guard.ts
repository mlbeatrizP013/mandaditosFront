import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
// Si ya tienes AuthService, puedes inyectarlo y usarlo en lugar de leer localStorage directamente.

type Role = 'cliente' | 'repartidor';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    // private auth: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // 1) Lee sesión desde servicio o localStorage
    // const session = this.auth.usuarioActivo;
    const raw = localStorage.getItem('usuarioActivo');
    const session = raw ? JSON.parse(raw) : null;

    // 2) Detecta rol de forma compatible (viejo y nuevo formato)
    const role: Role | null = (session?.user?.role ?? session?.role) ?? null;

    // 3) Verifica que haya sesión (token o al menos rol)
    const hasToken = !!(session?.access_token || session?.token);
    if (!session || (!hasToken && !role)) {
      return this.router.createUrlTree(['/login']);
    }

    // 4) Valida rol esperado (puede ser string o array de roles)
    const expected = route.data['role'] as Role | Role[] | undefined;
    if (expected) {
      const allowed = Array.isArray(expected)
        ? role !== null && expected.includes(role)
        : role === expected;

      if (!allowed) {
        return this.router.createUrlTree(['/login']);
      }
    }

    return true;
  }
}
