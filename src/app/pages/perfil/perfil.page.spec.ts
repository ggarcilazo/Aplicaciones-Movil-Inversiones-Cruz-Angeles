import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // ✅ Importación necesaria para ngModel
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  collectionData,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule], // ✅ FormsModule agregado aquí
})
export class PerfilPage implements OnInit {
  email: string = '';
  nombre: string = '';
  telefono: string = '';
  direccion: string = '';
  pedidos$: Observable<any[]> = new Observable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.email = user.email || '';
      const perfilRef = doc(this.firestore, `usuarios/${user.uid}`);
      const perfilSnap = await getDoc(perfilRef);
      if (perfilSnap.exists()) {
        const data = perfilSnap.data();
        this.nombre = data['nombre'] || '';
        this.telefono = data['telefono'] || '';
        this.direccion = data['direccion'] || '';
      }

      // Obtener historial de pedidos del usuario
      const pedidosRef = collection(this.firestore, 'pedidos');
      const q = query(pedidosRef, where('uid', '==', user.uid));
      this.pedidos$ = collectionData(q, { idField: 'id' });
    }
  }

  async guardarCambios() {
    const user = this.auth.currentUser;
    if (user) {
      const perfilRef = doc(this.firestore, `usuarios/${user.uid}`);
      await setDoc(perfilRef, {
        nombre: this.nombre,
        telefono: this.telefono,
        direccion: this.direccion,
        email: this.email,
      });
      this.mostrarAlerta('✅ Información actualizada correctamente');
    }
  }

  async eliminarPedido(id: string) {
    const docRef = doc(this.firestore, `pedidos/${id}`);
    await deleteDoc(docRef);
    this.mostrarAlerta('🗑 Pedido eliminado del historial.');
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Perfil',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
