import React,{ useContext } from 'react';

// !Components
import Buscar from '../ui/Buscar';
import Navegacion from './navegacion';
import Link from 'next/link';

// * CSS
import Boton from '../ui/Boton';


// ? Base de datos
import { FirebaseContext } from '../../firebase';

// ! FOR STYLE
import styled from '@emotion/styled';
import { css } from '@emotion/react';


const ContHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media(min-width: 768px){
    display: flex;
    justify-content:space-between;
  }
`;
const Logo = styled.a`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family:'Work Sans',sans-serif;
  margin-right: 2rem;
  cursor: pointer;
`;

const Header = () => {

    const { usuario,firebase }= useContext( FirebaseContext );

    return (
        <header
            css = {css`
                    border-bottom: 5px solid var(--gris3);
                    padding: 1rem 0;
                `}
        >
            <ContHeader>

                <div
                    css = {css`
                          display: flex;
                          align-items: center;
                    `}
                >
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>
                        <Buscar />

                        <Navegacion />
                </div>

                <div
                    css = {css`
                          display: flex;
                          align-items: center;
                    `}
                >
                    {usuario ? (
                        <>
                            <p css = {css`margin-right: 2rem;`}
                            >Hola: {usuario.displayName}</p>

                            <Boton
                                bgColor="true"
                                onClick={() => firebase.loginOut()}
                            >Cerrar Sesión</Boton>
                        </>

                    ) : (
                        <>
                            <Link href="/iniciar-sesion">
                                <Boton
                                    bgColor="true"
                                >Iniciar Sesión</Boton>
                            </Link>

                            <Link href="/crear-cuenta">
                                <Boton>Crear Cuenta</Boton>
                            </Link>
                        </>
                    )}

                </div>

            </ContHeader>
        </header>



    );
}

export default Header;