import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  addDoc,
  getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service'; // ✅ Importa tu servicio de autenticación

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class CarritoPage implements OnInit {
  carrito$: Observable<any[]> = new Observable();
  carritoData: any[] = [];

  constructor(
    private firestore: Firestore,
    private alertController: AlertController,
    private authService: AuthService // ✅ Inyectamos AuthService
  ) {}

  ngOnInit() {
    const carritoRef = collection(this.firestore, 'carrito');
    this.carrito$ = collectionData(carritoRef, { idField: 'id' });

    this.carrito$.subscribe((data) => {
      this.carritoData = data;
    });
  }

  async eliminarDelCarrito(id: string) {
    try {
      const docRef = doc(this.firestore, `carrito/${id}`);
      await deleteDoc(docRef);
      console.log('🗑 Producto eliminado del carrito');
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
    }
  }

  calcularTotal(): number {
    return this.carritoData.reduce((total, producto) => {
      const cantidad = producto.cantidad || 1;
      return total + producto.precio * cantidad;
    }, 0);
  }

  async realizarPedido() {
    if (this.carritoData.length === 0) {
      this.mostrarAlerta('Tu carrito está vacío.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Selecciona forma de pago',
      inputs: [
        { name: 'efectivo', type: 'radio', label: 'Pago en efectivo', value: 'efectivo', checked: true },
        { name: 'tarjeta', type: 'radio', label: 'Tarjeta', value: 'tarjeta' },
        { name: 'yape', type: 'radio', label: 'Yape / Plin', value: 'yape' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async (metodoPago) => {
            await this.procesarPedido(metodoPago);
          }
        }
      ]
    });

    await alert.present();
  }

  async procesarPedido(metodoPago: string) {
    const user = await this.authService.getCurrentUser(); // ✅ obtenemos el usuario actual
    if (!user) {
      this.mostrarAlerta('Debes iniciar sesión para realizar un pedido.');
      return;
    }

    const uid = user.uid;

    const productos = this.carritoData.map((p) => ({
      nombre: p.nombre,
      precio: p.precio,
      cantidad: p.cantidad || 1,
      subtotal: p.precio * (p.cantidad || 1),
    }));

    const pedido = {
      uid: uid, // ✅ este campo es esencial para el historial
      productos: productos,
      total: this.calcularTotal(),
      fecha: new Date(),
      estado: 'pendiente',
      metodoPago: metodoPago,
    };

    try {
      const pedidosRef = collection(this.firestore, 'pedidos');
      await addDoc(pedidosRef, pedido);

      // Limpiar carrito
      const carritoRef = collection(this.firestore, 'carrito');
      const snapshot = await getDocs(carritoRef);
      snapshot.forEach(async (docItem) => {
        await deleteDoc(doc(this.firestore, 'carrito', docItem.id));
      });

      this.mostrarAlerta(`🎉 Pedido realizado con éxito. Forma de pago: ${metodoPago.toUpperCase()}`);
    } catch (error) {
      console.error('❌ Error al procesar pedido:', error);
      this.mostrarAlerta('Error al procesar el pedido.');
    }
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
