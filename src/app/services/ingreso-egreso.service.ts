import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
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

  initIngresosEgresosListener( uid: string = '' ) {
    this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges() // el snapshotChanges()  es lo que retorna un observable 
      .pipe(
        map( snapshot => 
            //console.log(snapshot);            
            snapshot.map( doc => 
              //console.log('data ',doc.payload.doc.data());
              ({
                uid: doc.payload.doc.id,
                ...doc.payload.doc.data() as any
              })
            )            
          )
      )
      
      .subscribe( algo => console.log(algo) );
  }
}
