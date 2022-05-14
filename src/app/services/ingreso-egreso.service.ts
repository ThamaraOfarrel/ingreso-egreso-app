import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { Usuario } from '../models/usuario.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( 
                private firestore: AngularFirestore,
                private authService: AuthService
              ) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso )  {
    const uid: String = this.authService.user.uid ;
    console.log(`${uid}/ingresos-egresos`);
    
    return this.firestore.doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({...ingresoEgreso}) // esto hace referencia al documento
  }
}
