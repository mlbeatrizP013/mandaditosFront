import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');

    if (!usuario) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRole = route.data['role'];
    if (expectedRole && usuario.role !== expectedRole) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
