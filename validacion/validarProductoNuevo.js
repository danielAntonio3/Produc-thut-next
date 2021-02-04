
export default function validarProductoNuevo(valores){

    let errors ={};

    if(!valores.nombre){
        errors.nombre = 'El nombre del producto es obligatorio';
    }

    if(!valores.empresa){
        errors.empresa = 'El nombre de la empresa es obligatorio';
    }

    if(valores.url) {
        if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
            errors.url = 'La url no es valida';
        }
    }

    if(!valores.descripcion ){
        errors.descripcion = 'Agrega una descripción';
    }


    return errors;

}