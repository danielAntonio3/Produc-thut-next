import '../styles/globals.css';

// ! firebase
import firebase,{ FirebaseContext } from '../firebase';

// ! Ver si hay alguien iniciando sesión
import useAutenticacion from '../hooks/useAutenticacion';


const MyApp = props => {

    // ! Ver si hay alguien iniciando sesión
    const usuario = useAutenticacion();

    const {Component,pageProps} = props;

  return (
      <FirebaseContext.Provider
          value={{
              firebase,
              usuario
          }}
      >
        <Component {...pageProps} />
      </FirebaseContext.Provider>
  )

}

export default MyApp;
