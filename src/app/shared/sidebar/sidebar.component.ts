import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string | any = '' ;
  userSubs!: Subscription;

  constructor( 
                private auth: AuthService, 
                private router: Router,
                private store: Store<AppState>
              ) { }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
                      .pipe(
                        filter(({user})=> user != null)
                      )
                      .subscribe( ({user}) => this.nombre = user?.nombre );
  }

  logout(){
    this.auth.logout()
      .then( () => {
        this.router.navigate(['/login']);
      })
  }

}
