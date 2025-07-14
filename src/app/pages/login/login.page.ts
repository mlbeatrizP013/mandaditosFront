import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.email.trim() && this.password.trim()) {
      this.router.navigate(['/home']);
    } else {
      alert('Por favor, completa todos los campos');
    }
  }
}
