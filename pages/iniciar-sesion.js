import React,{useState} from 'react';
import { css } from '@emotion/react';

// ! COMPONENTES
import Layout from '../components/layout/Layout';

// * CSS
import { Formulario, Campo, InputSubmit, ErrorMessage } from '../components/ui/Formulario';

// ! Ejecuta las funciones
import useValidacion from '../hooks/useValidacion';

// ! VALIDACIONES
import validarInicioSesion from '../validacion/validarInicioSesion';

// ! IMPORTAR FIREBASE
import firebase from '../firebase';

// * Router
import Router from 'next/Router';

const IniciarSesion= () => {

    // ? state_inicial
    const STATE_INICIAL={
        correo:'',
        contrasena:'',
    }


    const [errores, setErrores] = useState(false);

    // ! ocupamos el hooks
    const {valores, error,
        handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL,validarInicioSesion,login);

    // * extraemos los valore
    const {correo, contrasena }= valores;

    // ? Función ve si existe un usuario en la base de datos
    async function login(){
        try {
            await firebase.login(correo,contrasena);
            await Router.push('/');


        }catch(error){

            console.error('hubo un error al autenticar el usuario ',error.message);
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
                    >Iniciar Sesión</h1>

                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >

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
                        {errores && <ErrorMessage>{errores}</ErrorMessage>}
                        <InputSubmit
                            type="submit"
                            value="Iniciar Sesión"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    );
}

export default IniciarSesion;
