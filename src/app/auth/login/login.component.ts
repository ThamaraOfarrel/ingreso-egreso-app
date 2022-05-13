import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor( 
                private fb: FormBuilder, 
                private authService: AuthService, 
                private router: Router
              ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login(){
    const { email, password } = this.loginForm.value ;

    Swal.fire({
      title: 'Auto close alert!',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.authService.loginUsuaro( email, password )
      .then(
        credenciales => {
           console.log(credenciales);
           Swal.close();
           this.router.navigate(['/']);
        }        
      )
      .catch( 
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          })
        }
      );
  }

}
 