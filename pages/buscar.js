import React,{useEffect,useState} from 'react';

// ! COMPONENTES DE ESTILOS
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';

// ! LEER EL CONTENIDO DE LA URI
import { useRouter } from 'next/Router';

// ? BASE DE DATOS
import useProductos from '../hooks/useProductos';


const Buscar = () => {

    //* OBTENIENDO LA URL
    const router = useRouter();
    //console.log(router.query);
    const { query: {q} } = router;

    const { productos } = useProductos('creado');
    const [resultado, setResultado] = useState([]);
    useEffect(()=>{
        const busqueda = q.toLowerCase();
        const filtro = productos.filter(producto =>{
            return (
                // !REVISA POR NOMBRE Y DESCRIPCION
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        });
        setResultado(filtro);

    },[productos,q]);

    return (
        <div>
            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {resultado.map(producto => (
                                <DetallesProducto
                                    key={producto.id}
                                    producto={producto}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Buscar;
