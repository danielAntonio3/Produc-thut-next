import React,{useState, useContext } from 'react';
import { useRouter } from "next/router";

// ! COMPONENTES
import Layout from '../components/layout/Layout';
import Error404 from '../components/layout/404';

// * COMBINAR LAS FUNCIONES
import useValidacion from "../hooks/useValidacion";

// ? VALIDAR LOS CAMPOS DEL FORMULARIO
import validarProductoNuevo from "../validacion/validarProductoNuevo";

// ? Base de datos
import { FirebaseContext } from "../firebase";

// * Estilos
import {css} from "@emotion/react";
// * COMPONENTES DE CSS PARA EL FORMULARIO
import {Campo, ErrorMessage, Formulario, InputSubmit} from "../components/ui/Formulario";



const NuevoProducto= () => {

    // ? state_inicial
    const STATE_INICIAL={
        nombre:'',
        empresa:'',
        url:'',
        descripcion:''
    }

    // ! STATE DE IMAGENES
    const [urlimagen, setUrlImagen] = useState('');


    // ! ERRORES AL SUBIR EL PRODUCTO
    const [errores, setErrores] = useState(false);

    // ! ocupamos el hooks
    const {valores, error,
        handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL,validarProductoNuevo,crearProducto);

    // * extraemos los valore
    const {nombre,empresa,url,descripcion }= valores;

    // ? CONTEXT DE FIREBASE
    // * la variable de firebase es para usar la base de datos
    // * la variable de usuario es para ver si hay un usuario
    const {usuario, firebase } = useContext( FirebaseContext );


    // ! hook de routing para redireccionar
    const router = useRouter();

    const handleFile = e => {
        if(e.target.files[0]){
            //console.log(e.target.files[0])
            setUrlImagen(e.target.files[0])
        }

    }

    // ! PARA SUBIR UNA IMAGEN
    const handleUpload = async () => {
        const uploadTask = await firebase.storage.ref(`products/${urlimagen.lastModified}${urlimagen.name}`).
        put(urlimagen);
        const downloadURL = await uploadTask.ref.getDownloadURL();

        return downloadURL;
    }


    // ? Función que crea un nuevo usuario
    async function crearProducto(){

        try {

            // * si el usuario no esta autenticado
            if(!usuario){
                return router.push('/iniciar-sesion');
            }

            // ! Crear el objeto de nuevo producto
            const producto = {
                nombre,
                empresa,
                url,
                urlimagen: await handleUpload(),
                descripcion,
                votos: 0,
                comentarios: [],
                creado: Date.now(),
                creador:{
                    id:usuario.uid,
                    nombre: usuario.displayName
                },
                haVotado: []
            }

            // ? Insertar en la base de datos en la coleccion productos y insertamos producto
            await firebase.db.collection( 'productos' ).add( producto );
            return await router.push('/');


        }catch(error){
            console.error('hubo un error al crear el usuario ',error.message);
            setErrores(error.message);
        }
    }



    // ! noValidate <!-- para deshabilitar algunas funciones del los input-->
    return(
        <div>
            <Layout>
                {!usuario ? <Error404/>:(
                    <>
                        <h1
                            css = {css`
                          text-align: center;
                          margin-top: 5rem;
                        `}
                        >Nuevo Producto</h1>
                        <Formulario
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <fieldset>
                                <legend>Información General</legend>
                                <Campo>
                                    <label htmlFor="nombre">Nombre:</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        placeholder="Nombre del producto"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {error.nombre && <ErrorMessage>{error.nombre}</ErrorMessage>}

                                <Campo>
                                    <label htmlFor="empresa">Empresa:</label>
                                    <input
                                        type="text"
                                        id="empresa"
                                        placeholder="Nombre de la empresa"
                                        name="empresa"
                                        value={empresa}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {error.empresa && <ErrorMessage>{error.empresa}</ErrorMessage>}


                                <Campo>
                                    <label htmlFor="image">Product's image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="image"
                                        name="image"
                                        onInput={(e) => handleFile(e)}
                                    />
                                </Campo>

                                <Campo>
                                    <label htmlFor="url">Url:</label>
                                    <input
                                        type="url"
                                        id="url"
                                        placeholder="Url"
                                        name="url"
                                        value={url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {error.url && <ErrorMessage>{error.url}</ErrorMessage>}

                            </fieldset>

                            <fieldset>
                                <legend>Sobre tu Producto</legend>
                                <Campo>
                                    <label htmlFor="descripcion">Descripción:</label>
                                    <textarea
                                        placeholder="Descripción del producto"
                                        id="descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                    </textarea>
                                </Campo>
                                {error.descripcion && <ErrorMessage>{error.descripcion}</ErrorMessage>}
                            </fieldset>

                            {errores && <ErrorMessage>{errores}</ErrorMessage>}

                            <InputSubmit
                                type="submit"
                                value="Crear Producto"
                            />
                        </Formulario>
                    </>
                )}

            </Layout>
        </div>
    );
}

export default NuevoProducto;
