import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MainUserComponent } from './main-user/main-user.component';

@NgModule({
  declarations: [
MainUserComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [

MainUserComponent,
  ]
})
export class ComponentsModule { }
