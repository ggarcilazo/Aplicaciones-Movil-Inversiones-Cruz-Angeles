import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonText
  ]
})
export class ContactoPage {
  nombre: string = '';
  correo: string = '';
  mensaje: string = '';
  mensajeEnviado = false;

  enviarMensaje() {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe9MBrg_nerzA0DbhljqFNhPl8_CfneMrEIPHGEwrNiPAyJxg/formResponse';

    const formData = new FormData();
    formData.append('entry.1689958816', this.nombre);
    formData.append('entry.57277534', this.correo);
    formData.append('entry.194917442', this.mensaje);

    fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(() => {
      this.mensajeEnviado = true;

      // Limpiar formulario
      this.nombre = '';
      this.correo = '';
      this.mensaje = '';

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        this.mensajeEnviado = false;
      }, 3000);
    }).catch(error => {
      console.error('Error al enviar mensaje:', error);
    });
  }
}
