
export class Usuario {
    
    static fromFirebase( firestoreUser: any ) { //Toco sin desestructuracion
        return new Usuario(firestoreUser.nameuid, firestoreUser.nombre, firestoreUser.email)
    }
    


    constructor(
        public uid: string,
        public nombre: string, 
        public email: string
    ) {}
}