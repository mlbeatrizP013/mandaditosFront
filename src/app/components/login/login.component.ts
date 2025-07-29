import { Component, OnInit } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
@Component({
    standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  {
  isLogin = true;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  constructor(private router: Router) { }
toggleForm() {
    this.isLogin = !this.isLogin;
    // Limpiar campos cuando cambias formulario
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

    login() {
    if (this.email.trim() && this.password.trim()) {
      // Aquí podrías agregar lógica real de login
      this.router.navigate(['/home']);
    } else {
      alert('Por favor, completa todos los campos');
    }
  }
    register() {
    if (
      this.email.trim() &&
      this.password.trim() &&
      this.confirmPassword.trim()
    ) {
      if (this.password !== this.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      // Aquí podrías agregar lógica real de registro
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      this.toggleForm(); // Volver a login luego de registrar
    } else {
      alert('Por favor, completa todos los campos');
    }
  }
  ngOnInit() {}

}
