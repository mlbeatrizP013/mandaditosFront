import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepartidorPage } from './repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: RepartidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepartidorPageRoutingModule {}
