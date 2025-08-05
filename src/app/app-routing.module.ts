import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
    {
    path: 'main-user',
    loadChildren: () => import('./pages/main-user/main-user.module').then(m => m.MainUserPageModule),
    canActivate: [AuthGuard],
    data: { role: 'cliente' } // 👈 solo clientes
  },
  {
    path: 'repartidor',
    loadChildren: () => import('./pages/repartidor/repartidor.module').then(m => m.RepartidorPageModule),
    canActivate: [AuthGuard],
    data: { role: 'repartidor' } // 👈 solo repartidores
  },  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
