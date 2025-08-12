import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const raw = localStorage.getItem('usuarioActivo');
    let authReq = req;

    if (raw) {
      const { access_token } = JSON.parse(raw);
      if (access_token) {
        authReq = req.clone({ setHeaders: { Authorization: `Bearer ${access_token}` } });
      }
    }
    return next.handle(authReq);
  }
}
