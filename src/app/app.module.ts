import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// 👇 NUEVO: HTTP para consumir tu backend
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// 👇 Opcional (si quieres ngModel disponible globalmente)
import { FormsModule } from '@angular/forms';

// 👇 NUEVO: tu interceptor que añade el token a cada request
import { TokenInterceptor } from './core/token.interceptor'; // ajusta la ruta si lo guardaste en otro lado

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, // ✅ habilita HttpClient
    FormsModule       // ✅ útil si usas [(ngModel)] en componentes sin su propio módulo
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // ✅ registra el interceptor para adjuntar Authorization: Bearer <token>
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
