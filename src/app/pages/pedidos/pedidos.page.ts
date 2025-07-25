import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, collectionData, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PedidosPage implements OnInit {
  pedidos$: Observable<any[]> = new Observable();

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const pedidosRef = collection(this.firestore, 'pedidos');
    this.pedidos$ = collectionData(pedidosRef, { idField: 'id' });
  }

  async cancelarPedido(id: string) {
    try {
      const docRef = doc(this.firestore, `pedidos/${id}`);
      await deleteDoc(docRef);
      console.log('❌ Pedido cancelado');
    } catch (error) {
      console.error('⚠️ Error al cancelar pedido:', error);
    }
  }

  async marcarComoEntregado(id: string) {
    try {
      const docRef = doc(this.firestore, `pedidos/${id}`);
      await updateDoc(docRef, { estado: 'entregado' });
      console.log('✅ Pedido entregado');
    } catch (error) {
      console.error('⚠️ Error al actualizar estado:', error);
    }
  }
}
