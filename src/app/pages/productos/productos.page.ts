import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';

// ✅ Firebase
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption
  ]
})
export class ProductosPage implements OnInit {
  productos = [
    { nombre: 'Melamina Roble', precio: 'S/ 40.00 m²', imagen: 'assets/icon/roble.jpg', categoria: 'Madera' },
    { nombre: 'Melamina Nogal', precio: 'S/ 45.00 m²', imagen: 'assets/icon/nogal.jpg', categoria: 'Madera' },
    { nombre: 'Melamina Blanco', precio: 'S/ 38.00 m²', imagen: 'assets/icon/blanco.jpg', categoria: 'Blanco' },
    { nombre: 'Melamina Gris Perla', precio: 'S/ 42.00 m²', imagen: 'assets/icon/gris.jpg', categoria: 'Color' },
    { nombre: 'Melamina Haya', precio: 'S/ 41.50 m²', imagen: 'assets/icon/haya.jpg', categoria: 'Madera' },
    { nombre: 'Melamina Cedro', precio: 'S/ 43.00 m²', imagen: 'assets/icon/cedro.jpg', categoria: 'Madera' },
    { nombre: 'Melamina Olmo', precio: 'S/ 44.50 m²', imagen: 'assets/icon/olmo.jpg', categoria: 'Madera' },
    { nombre: 'Melamina Maple', precio: 'S/ 39.00 m²', imagen: 'assets/icon/maple.jpg', categoria: 'Madera' },
    { nombre: 'Melamina Wengue', precio: 'S/ 46.00 m²', imagen: 'assets/icon/wengue.jpg', categoria: 'Color' },
    { nombre: 'Melamina Pino', precio: 'S/ 37.00 m²', imagen: 'assets/icon/pino.jpg', categoria: 'Madera' }
  ];

  productosFiltrados: any[] = [];
  busqueda: string = '';
  categoriaSeleccionada: string = '';
  categorias: string[] = ['Madera', 'Blanco', 'Color'];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.filtrarProductos();
  }

  async agregarAlCarrito(producto: any) {
    const carritoRef = doc(this.firestore, `carrito/${producto.nombre}`);
    const docSnap = await getDoc(carritoRef);
    const precioNumerico = parseFloat(producto.precio.replace(/[^0-9.]/g, ''));

    if (docSnap.exists()) {
      const data = docSnap.data();
      const nuevaCantidad = (data['cantidad'] || 1) + 1;
      await updateDoc(carritoRef, {
        cantidad: nuevaCantidad
      });
      console.log(`🔁 Cantidad actualizada: ${nuevaCantidad}`);
    } else {
      await setDoc(carritoRef, {
        nombre: producto.nombre,
        precio: precioNumerico,
        imagen: producto.imagen,
        cantidad: 1
      });
      console.log('✅ Producto agregado al carrito');
    }
  }

  filtrarProductos() {
    const termino = this.busqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(prod => {
      const coincideNombre = prod.nombre.toLowerCase().includes(termino);
      const coincideCategoria = this.categoriaSeleccionada === '' || prod.categoria === this.categoriaSeleccionada;
      return coincideNombre && coincideCategoria;
    });
  }
}
