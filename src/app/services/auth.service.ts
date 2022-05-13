import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubsccription!: Subscription;

  constructor( 
                public auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private store: Store<AppState>
              ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      if(fuser){
        this.userSubsccription = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (firestoreUser) => {      
            const user = Usuario.fromFirebase( firestoreUser )  
            this.store.dispatch( authActions.setUser({user: user}) ) 
          });
      } else {
        this.userSubsccription.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
      }
    });
  }

  crearUsuario( nombre:string, email:string, password:string ){
    console.log( {nombre, email, password} )
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({user}) => {
        const newUser = <Usuario><unknown>{ nameuid: user?.uid, nombre: nombre, email: user?.email };
        return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser})
      });
  }

  loginUsuaro( email:string, password: string ){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe( 
      map( fbUser => fbUser != null )
    )
  }
}
