
export default function validarInicioSesion(valores) {

    let errors = {};


    // ? Validamos el correo
    if(!valores.correo){
        errors.correo = 'El correo es obligatorio';
    } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.correo)){
        errors.correo = 'El correo no es valido';
    }

    // ? Validamos el password
    if(!valores.contrasena){
        errors.contrasena = 'La contraseña es obligatorio';
    } else if(valores.contrasena.length < 6){
        errors.contrasena = 'La contraseña debe tener minimo 6 caracteres';
    }


    return errors;
}