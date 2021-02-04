import app from 'firebase/app';

// ! incluir el auto de firebase
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import firebaseConfig from './config';

class Firebase{
    constructor(){
        // ! error común el constructor se inicializa mas de una vez con esto solucionamos el problema
        if(!app.apps.length){
            app.initializeApp(firebaseConfig);
        }
        // * autenticado
        this.auth = app.auth();

        // * registro de productos
        this.db = app.firestore();

        // * imagenes
        this.storage = app.storage();
    }


    // ? función para crear un nuevo usuario
   async registrar(nombre,correo,contrasena){
        // * Metodo para crear un usuario

        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(correo,contrasena);

        console.log(nuevoUsuario);

        return await nuevoUsuario.user.updateProfile({
            displayName: nombre
        });
    }


    // ? función para iniciar sesión
    async login(correo,contrasena){

        return this.auth.signInWithEmailAndPassword(correo,contrasena);

    }


    // ? Función que cierra la sesión
    async loginOut(){
        await this.auth.signOut();

    }

}

const firebase = new Firebase();

export default firebase;
