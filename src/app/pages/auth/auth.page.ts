import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonInput,
  IonLabel,
  IonItem,
  IonImg,
  AlertController,
  NavController
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonLabel,
    IonItem,
    IonButton,
    IonImg
  ]
})
export class AuthPage {
  isLogin = true;
  email = '';
  password = '';
  name = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  async login() {
  try {
    await this.authService.login(this.email, this.password);
    this.showAlert('¡Bienvenido!', 'Inicio de sesión exitoso');
    this.navCtrl.navigateRoot('/tabs/inicio'); // Redirige al tab con barra inferior
  } catch (error: any) {
    this.showAlert('Error', error.message);
  }
}

  async register() {
  try {
    await this.authService.register(this.email, this.password, this.name);
    this.showAlert('¡Registro exitoso!', 'Ahora puedes iniciar sesión');
    this.toggleMode(); // Cambiar a modo login
  } catch (error: any) {
    this.showAlert('Error', error.message);
  }
}


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
