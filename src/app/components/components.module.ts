import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MainUserComponent } from './main-user/main-user.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
MainUserComponent,
LoginComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
     FormsModule
  ],
  exports: [
LoginComponent,
MainUserComponent
  ]
})
export class ComponentsModule { }
