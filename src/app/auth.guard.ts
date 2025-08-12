// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // 1) sin sesión => al login
    if (!this.auth.isLoggedIn) {
      return this.router.parseUrl('/login');
    }

    // 2) con sesión pero rol incorrecto => redirige a su área
    const requiredRole = route.data?.['role'] as 'cliente' | 'repartidor' | undefined;
    const currentRole = this.auth.currentRole;

    if (requiredRole && currentRole !== requiredRole) {
      return this.router.parseUrl(currentRole === 'cliente' ? '/main-user' : '/repartidor');
    }

    return true; // ok
  }
}
