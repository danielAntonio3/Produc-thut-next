import React,{ useEffect, useState} from 'react';

const useValidacion = (stateInicial,validar,funcion) =>{


    const [valores, setValores] = useState(stateInicial);

    const [error, setError] = useState({});

    const [submitForm, setSubmitForm] = useState(false);



    useEffect(()=>{

        // ? Verificar si tiene un valor TRUE
        if(submitForm){

            // ! Verificamos si hay algún error
            const noErros = Object.keys(error).length === 0;

            // ? Verificamos si no hay error
            if(noErros){

                // ? Ejecutamos la función que esta recibiendo del los componentes
                funcion();
            }
            // ! Reiniciar el submitForm para evitar que se cicle
            setSubmitForm(false);
        }

    },[error]);


    // * Función que se ejecuta conforme el usuario escribe algo en algún componente
    const handleChange = e =>{
        setValores({
            ...valores,
            [e.target.name]: e.target.value
        });
    }

    // * Función que se ejecuta cuando el usuario hace un submit en algun componente
    const handleSubmit = e =>{
        e.preventDefault();

        const erroresValidaciones = validar(valores);
        setError(erroresValidaciones);
        setSubmitForm(true);
    }

    // * Cuando se realiza el evento de blur
    const handleBlur = () =>{

        const erroresValidaciones = validar(valores);
        setError(erroresValidaciones);
    }

    return{
        // ! Primero pasamos los states
        valores,
        error,
        // ! Funciones
        handleSubmit,
        handleChange,
        handleBlur

    }

}


export default useValidacion;

