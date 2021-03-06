import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm!: FormGroup;
  cargando: boolean = false;
  uiSuscription!: Subscription;

  constructor( 
                private authService: AuthService,  
                private fb : FormBuilder,  
                private store: Store<AppState>, 
                private router: Router 
              ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required],
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSuscription = this.store.select('ui')
                          .subscribe( ui => {
                            this.cargando = ui.isLoading 
                          });
  }

  ngOnDestroy(): void {
    this.uiSuscription.unsubscribe();
  }

  crearUsuario() {

    if( this.registroForm.invalid ){ return ; }


    this.store.dispatch( ui.isLoading() );

    /*
    Swal.fire({
      title: 'Auto close alert!',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    */

    const { nombre, correo, password } = this.registroForm.value ;
    this.authService.crearUsuario( nombre, correo, password )
      .then(
        credenciales => {
           console.log(credenciales);
           //Swal.close();
           this.store.dispatch( ui.stopLoading() );
           this.router.navigate(['/']);
        }        
      )
      .catch( 
        err => {      
          this.store.dispatch( ui.stopLoading() );    
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          })
        }
      );
  }

}
