import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';

import { authState } from 'rxfire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.user$ = authState(this.auth);
  }

  // Iniciar sesión
  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Registrar usuario y guardar nombre en Firestore
  async register(email: string, password: string, name: string): Promise<any> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = cred.user.uid;

    const userRef = doc(this.firestore, `usuarios/${uid}`);
    await setDoc(userRef, {
      uid: uid,
      email: email,
      nombre: name
    });

    return cred;
  }

  // Cerrar sesión
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  // Obtener datos del usuario desde Firestore
  async getUserData(uid: string): Promise<any> {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data() : null;
  }

  // Actualizar datos del usuario en Firestore
  async updateUserData(uid: string, data: any): Promise<void> {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    await setDoc(ref, data, { merge: true }); // merge = conserva lo anterior
  }
}
