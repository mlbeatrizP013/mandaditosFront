import { Component, OnInit } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.scss'],
})
export class MainUserComponent{
  estado: 'entregados' | 'proceso' = 'proceso';
    pedidosEnProceso = [
    { descripcion: 'Pedido 1', hora: '10:00 AM' },
    { descripcion: 'Pedido 2', hora: '11:00 AM' }
  ];

  pedidosEntregados = [
    { descripcion: 'Pedido entregado 1', hora: '9:00 AM' }
  ];
  constructor() { }



}
