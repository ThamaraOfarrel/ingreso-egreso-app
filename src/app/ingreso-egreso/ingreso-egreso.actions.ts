import { createAction, props } from "@ngrx/store";
import { IngresoEgreso } from "../models/ingreso-egreso.model";

export const unSetItems = createAction('[] Unset Items');

export const setItems = createAction(
    '[IngresoEgreso] Set Item',
    props<{ items: IngresoEgreso[] }>()
);