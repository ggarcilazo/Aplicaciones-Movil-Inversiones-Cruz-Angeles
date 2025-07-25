import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  AlertController,
  NavController
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';
import {
  Firestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class PerfilPage implements OnInit {
  nombre: string = '';
  email: string = '';
  uid: string = '';
  historial: any[] = [];

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.email = user.email || '';
      this.uid = user.uid;

      const userData = await this.authService.getUserData(this.uid);
      if (userData) {
        this.nombre = userData.nombre || '';
      }

      await this.obtenerHistorial();
    }
  }

  async actualizarPerfil() {
    try {
      await this.authService.updateUserData(this.uid, { nombre: this.nombre });
      const alert = await this.alertController.create({
        header: '✅ Actualizado',
        message: 'Tu nombre ha sido actualizado correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: '❌ Error',
        message: 'No se pudo actualizar el perfil.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async obtenerHistorial() {
    try {
      const pedidosRef = collection(this.firestore, 'pedidos');
      const snapshot = await getDocs(pedidosRef);
      this.historial = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((p: any) => p.uid === this.uid);
    } catch (error) {
      console.error('❌ Error al obtener historial de compras:', error);
    }
  }

  async eliminarPedido(pedidoId: string) {
    const confirm = await this.alertController.create({
      header: '¿Eliminar pedido?',
      message: '¿Estás seguro de que deseas eliminar este pedido?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              const pedidoRef = doc(this.firestore, `pedidos/${pedidoId}`);
              await deleteDoc(pedidoRef);
              this.historial = this.historial.filter(p => p.id !== pedidoId);
              this.mostrarMensaje('Pedido eliminado correctamente.');
            } catch (error) {
              this.mostrarMensaje('Error al eliminar el pedido.');
              console.error(error);
            }
          }
        }
      ]
    });

    await confirm.present();
  }

  async mostrarMensaje(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.navCtrl.navigateRoot('/auth');
  }
}
