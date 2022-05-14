
export class Usuario {
    
    static fromFirebase( nameuid: string, nombre:string, email:string ) {
        const uid =  nameuid ;
        console.log('uid',uid)
        return new Usuario(uid, nombre, email)
    }

      constructor(
        public uid: string,
        public nombre: string, 
        public email: string
    ) {}
}