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
      console.log('fuser ',fuser);
      console.log('fuser ',fuser?.uid);
      console.log('fuser ',fuser?.email);
      if( fuser ){
        console.log(`${fuser.uid}/usuario`);
        this.userSubsccription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) =>{
            console.log('firestoreUser',firestoreUser);
            //const tempUser = new Usuario('a','b','c@c.com')
            //this.store.dispatch( authActions.setUser( {user: tempUser} ));
            
            //console.log(firestoreUser.nameuid,firestoreUser.nombre,firestoreUser.email);            
            const user = Usuario.fromFirebase(firestoreUser.nameuid,firestoreUser.nombre,firestoreUser.email)
            console.log('user ',user)
            this.store.dispatch( authActions.setUser( {user} ));
            
          })
      } else {
        console.log('else');
        //this.userSubsccription.unsubscribe(); // CUIDADOOOO
        this.store.dispatch( authActions.unSetUser());        
      }
      
      
    })
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
