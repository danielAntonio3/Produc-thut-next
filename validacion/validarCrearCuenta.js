
export default function validarCrearCuenta(valores) {

    let errors = {};

    // ? Validamos el nombre
    if(!valores.nombre){
        errors.nombre = 'El nombre es obligatorio';
    }

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

    if(!valores.contrasena2){
        errors.contrasena2 = 'Verificar contraseñas es obligatorio';
    } else if(valores.contrasena2 !== valores.contrasena && valores.contrasena2.length > 0 ){
        errors.contrasena2 = 'Las contraseñas no coinciden';
    }

    return errors;
}