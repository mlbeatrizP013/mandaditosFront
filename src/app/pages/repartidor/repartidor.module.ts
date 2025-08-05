import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepartidorPageRoutingModule } from './repartidor-routing.module';

import { RepartidorPage } from './repartidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepartidorPageRoutingModule
  ],
  declarations: [RepartidorPage]
})
export class RepartidorPageModule {}
