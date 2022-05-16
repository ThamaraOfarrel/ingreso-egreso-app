import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActons from '../ingreso-egreso/ingreso-egreso.actions'

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs!: Subscription;
  ingresosSubs!: Subscription;

  constructor( 
                private store: Store<AppState>,
                private ingresoEgresoService: IngresoEgresoService
              ) { }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter( auth => auth.user != null ) // este pipe es sagrado, perite invalidar el estado inicial null ahorrando recurso 
      )
      .subscribe( ({user}) => {
        //console.log(user);
        this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user?.uid) 
          .subscribe( ingresosEgresosFB => 
            this.store.dispatch( ingresoEgresoActons.setItems({ items: ingresosEgresosFB }))
          );
      });
  }

}
