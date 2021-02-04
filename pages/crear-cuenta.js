import React,{useState} from 'react';
import { css } from '@emotion/react';

// ! COMPONENTES
import Layout from '../components/layout/Layout';

// ! ESTILOS
import { Formulario, Campo, InputSubmit, ErrorMessage } from '../components/ui/Formulario';

// ! Ejecuta las funciones
import useValidacion from '../hooks/useValidacion';

// ! VALIDACIONES
import validarCrearCuenta from '../validacion/validarCrearCuenta';

// ! IMPORTAR FIREBASE
import firebase from '../firebase';

// * Router
import Router from 'next/Router';

const CrearCuenta= () => {

    // ? state_inicial
    const STATE_INICIAL={
        nombre:'',
        correo:'',
        contrasena:'',
        contrasena2:''
    }


    const [errores, setErrores] = useState(false);

    // ! ocupamos el hooks
    const {valores, error,
        handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL,validarCrearCuenta,crearCuenta);

    // * extraemos los valore
    const {nombre, correo, contrasena,contrasena2}= valores;

    // ? Función que crea un nuevo usuario
    async function crearCuenta(){
        try {
            await firebase.registrar(nombre,correo,contrasena);
            await Router.push('/');

        }catch(error){

            console.error('hubo un error al crear el usuario ',error.message);
            setErrores(error.message);
        }
    }


    // ! noValidate <!-- para deshabilitar algunas funciones del los input-->
    return(
        <div>
            <Layout>
                <>
                    <h1
                        css = {css`
                          text-align: center;
                          margin-top: 5rem;
                        `}
                    >Crear Cuenta</h1>
                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Campo>
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                placeholder="Tu Nombre"
                                name="nombre"
                                value={nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {error.nombre && <ErrorMessage>{error.nombre}</ErrorMessage>}

                        <Campo>
                            <label htmlFor="correo">Correo:</label>
                            <input
                                type="email"
                                id="correo"
                                placeholder="Tu Correo"
                                name="correo"
                                value={correo}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {error.correo && <ErrorMessage>{error.correo}</ErrorMessage>}

                        <Campo>
                            <label htmlFor="contrasena">Contraseña:</label>
                            <input
                                type="password"
                                id="contrasena"
                                placeholder="Tu Contraseña"
                                name="contrasena"
                                value={contrasena}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {error.contrasena && <ErrorMessage>{error.contrasena}</ErrorMessage>}

                        <Campo>
                            <label htmlFor="contrasena2">Verificar Contraseña:</label>
                            <input
                                type="password"
                                id="contrasena2"
                                placeholder="Verificar Contraseña"
                                name="contrasena2"
                                value={contrasena2}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {error.contrasena2 && <ErrorMessage>{error.contrasena2}</ErrorMessage>}
                        {errores && <ErrorMessage>{errores}</ErrorMessage>}
                        <InputSubmit
                            type="submit"
                            value="Crear Cuenta"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    );
}

export default CrearCuenta;
