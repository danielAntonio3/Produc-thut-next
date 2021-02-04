import React,{useState} from 'react';

// * DIRECCIONAR AL USUARIO
import Router from 'next/router';

// * COMPONENTES DE STILOS
import styled from '@emotion/styled';
import { css } from '@emotion/react';


const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`;

const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url('buscar.png');
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 5px;
  border: none;
  text-indent: -99999px;

  &:hover {
    cursor: pointer;
  }
`;

const Buscar = ()=>{

    // * STATE PARA LA BUSQUEDA
    const [busqueda,setBusqueda]= useState('');

    const buscarProducto = e =>{
        e.preventDefault();
        //console.log('Bucando...',busqueda);

        if(busqueda.trim() === '') return;

        // ! REDIRECCIONAR A /BUSQUER
        Router.push({
            pathname: '/buscar',
            query: { q: busqueda}
        });
    }

    return(
        <>
        <form
            css={css`
                    position: relative;
            `}
            onSubmit={buscarProducto}
        >
            <InputText
                type="text"
                placeholder="Buscar productos"
                onChange={ e => setBusqueda(e.target.value)}
            />
            <InputSubmit
                type="submit"
            >Buscar</InputSubmit>
        </form>
        </>
    );
}

export default Buscar;