import React,{useEffect, useContext, useState} from 'react';

// !PARA OBTENER LA URL  (trabaja com el router dinámico)
import { useRouter } from 'next/router';

// ! PARA TRABAJAR CON LA BASE DE DATOS
import { FirebaseContext } from '../../firebase';

// ! PARA EL CSS DE LAS ETIQUETAS
import { css } from '@emotion/react';
import styled from '@emotion/styled';

// *COMPONENTES
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';

// ! PARA DARLE UN FORMATO A LA FECHA
import formatDistanceToNow from "date-fns/formatDistanceToNow";
// ! PARA CAMBIAR EL IDIOMA
import {es} from "date-fns/locale";

// ! COMPONENTES DE ESTILOS
import { Campo,InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

// *COMPONENTES TIPO STYLED
const ContenedorProducto = styled.div`
    @media (min-width:768px){
      display:grid;
      grid-template-columns: 2fr 1fr;
      column-gap: 2rem;
    }
    
`;
const CreadorProducto = styled.p`
  padding: .5rem 2rem;
  background-color: #DA552F;
  color: #fff;
  text-transform: uppercase;
  font-weight: 800;
  display: inline-block;
  text-align: center;
`;


const Producto = () => {

    // ? STATE DEL COMPONENETE
    const [producto , setProducto] = useState({});

    // ? STATE PARA LOS ERRORES
    const [error, setError] = useState(false);

    // ? STATE PARA LOS COMENTARIOS
    const [comentario, setComentar] = useState({});

    // ? STATE PARA CONSULTA DE BASE DE DATOS
    const [consultarDB,setConsularDB] = useState(true);

    //* OBTENIENDO LA URL
    const router = useRouter();
    //console.log(router);
    const { query: {id} } = router;

    // ? CONTEXT DE FIREBASE
    // * la variable de firebase es para usar la base de datos
    // * la variable de usuario es para ver si hay un usuario
    const { firebase, usuario } = useContext( FirebaseContext );


    useEffect(() =>{

        // * Consultar la base de datos
        if(id && consultarDB === true){
            const obtenerProducto = async ()=> {

                const productoQuery = await firebase.db.collection( 'productos' ).doc(id);
                const producto = await productoQuery.get();
                // !exists es para saber si hay datos
                if(producto.exists){
                    setProducto(producto.data());
                    //console.log("EL PRODUCTO EXISTE");
                    // ! REINICIAR LA CONSULTA
                    setConsularDB(false);
                }else{
                   // console.log("EL PRODUCTO NO EXISTE");
                    setError(true);
                    setConsularDB(false);
                }

            }

            obtenerProducto();
        }

    },[id])

    // ! PARA MOSTRAR TEXTO MIENTAS CARGA
    if(Object.keys(producto).length === 0 && !error) return 'Cargando......'

    const {comentarios, descripcion, nombre, creado, empresa, url, urlimagen, votos, creador, haVotado } = producto;

    // *ADMINISTRAR LOS VOTOS
    const votarProducto = () =>{
        if(!usuario){
            return router.push('/iniciar-sesion');
        }
        // * OBTENER Y SUMAR BOTOS
        const nuevoTotal = votos + 1;
        //console.log(nuevoTotal);

        // ! COMPROBAMOS SI NO HA VOTADO ESTE USUARIO
        if(haVotado.includes(usuario.uid)) return;

        // !SI NO HA VOTADO SE AGREGA A LA LISTA DE BOTADO
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // ! ACTUALIZAR EN LA BASE DE DATOS EL TOTAL DE VOTOS Y AGREGAR EL ID DEL USUARIO QUE A VOTADO
        firebase.db.collection( 'productos' ).doc(id).update({votos: nuevoTotal, haVotado: nuevoHaVotado});

        // ! ACTUALIZAR EL STATE
        setProducto({
            ...producto,
            votos: nuevoTotal
        })
        // ! REINICIAMOS PARA QUE REALICE LA CONSULTA DE NUEVO
        setConsularDB(true);
    }

    // * COMENTARIOS AGREGADO
    const comentarioCharge= e =>{
        setComentar({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    // * FUNCION QUE AGREGA EL COMENTARIO EN LA BASE DE DATOS
    const agregarComentario= e =>{
        e.preventDefault();
        if(!usuario){
            return router.push('/iniciar-sesion');
        }

        // ! INFORMACIÓN EXTRA DEL COMENTARIO
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // * TOMAR COPIA DE COMENTARIOS Y AGREGAR AL ARREGLO
        const nuevoComentarios= [...comentarios,comentario];

        // * ACTUALIZAR LA BASE DE DATOS
        firebase.db.collection( 'productos' ).doc(id).update({comentarios: nuevoComentarios});
        // * ACTUALIZAR EL STATE
        setProducto({
            ...producto,
            comentarios: nuevoComentarios
        })
        // ! REINICIAMOS PARA QUE REALICE LA CONSULTA DE NUEVO
        setConsularDB(true);
    }

    // *FUNCION PARA SABER SI ES CREADOR
    const esCreador = id =>{
        if(creador.id === id){
            return true;
        }
    }

    // * FUNCION QUE REVISA QUE EL CREADOR DEL PRODUCTO SEA AL MISMO QUE ESTA AUTENTICADO
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid){
            return true;
        }
    }

    // * FUNCION PARA ELIMINAR UN PRODUCTO
    const eliminarProducto= async() =>{
        if(!usuario){
            return router.push('/iniciar-sesion');
        }
        if(creador.id !== usuario.uid){
            return router.push('/');
        }

        try{
           await firebase.db.collection( 'productos' ).doc(id).delete();
            router.push('/');
        }catch(error){
            console.log(error)
        }

    }

    return(
        <Layout>
            <>
                {error ? <Error404/>:(
                    <div className="contenedor">
                        <h1 css={css`
                            text-align: center;
                            margin-top:5rem;
                          `}
                        >{nombre}</h1>

                        <ContenedorProducto>
                            <div>
                                <p>Creado hace: {formatDistanceToNow(new Date(creado),{locale:es})}</p>
                                <p>Por: {creador.nombre} de {empresa} </p>
                                <img src={urlimagen} />
                                <p>{descripcion}</p>
                                {usuario &&(
                                    <>
                                        <h2>Agrega tu comentario </h2>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo >
                                                <input
                                                    type="text"
                                                    placeholder="Agrega tu comentario"
                                                    name="mensaje"
                                                    onChange={comentarioCharge}
                                                />
                                            </Campo>
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar Comentario"
                                            />
                                        </form>
                                    </>
                                )}
                                <h2
                                    css = {css`
                                        margin: 2rem 0;
                                      `}
                                >Comentarios</h2>
                                {comentarios.length === 0? <p>"Aun no hay comentarios"</p> :(
                                    <ul>
                                        {comentarios.map((comentario,i) =>(
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;  
                                                `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                    <span
                                                        css={css`
                                                          font-weight: bold;
                                                        `}
                                                    >{' '}{comentario.usuarioNombre}</span>
                                                </p>

                                                {esCreador(comentario.usuarioId) &&
                                                <CreadorProducto>Es Creador</CreadorProducto>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >Visitar url</Boton>

                                <div
                                    css={css`
                                  margin-top:5rem;
                                `}
                                >
                                    <p
                                        css = {css`
                                  text-align:center;
                                  `}
                                    >{votos} votos</p>
                                    {usuario && (
                                        <>
                                            <Boton
                                                onClick={votarProducto}
                                            >Votar</Boton>
                                        </>
                                    )}
                                </div>

                            </aside>
                        </ContenedorProducto>
                        {puedeBorrar() &&
                            <Boton
                                onClick={eliminarProducto}
                            >Eliminar Producto</Boton>
                        }
                    </div>
                )}
            </>
        </Layout>
    )

}


export default Producto;