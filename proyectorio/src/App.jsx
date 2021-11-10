import React from "react";
import { useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import { UserContext } from "context/userContext";


//Layouts
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from "layouts/PrivateLayout";
import AuthLayout from "layouts/AuthLayout";

//Pages
import Index from './pages/Index';
import Error404 from "pages/Error404";
import Usuarios from './pages/admin/Usuarios';
import Proyectos from './pages/admin/Proyectos';
import Admin from "pages/admin/Perfil";
import Avances from "pages/admin/Avances";




function App() {
  const [userData, setUserData] = useState({});
  return (
    <Auth0Provider
      domain="ezequiellr.us.auth0.com"
      clientId="0b1BbovaR2Sm4kaPTWwnNgr13Fayd0fV"
      redirectUri="http://localhost:3000/admin"
      audience='autenticacion-proyectorio'>

      <div className='App'>
        <UserContext.Provider value={{ userData, setUserData }}> 
          <Router>
            <Switch>

            <Route path={['/admin', '/admin/proyectos', '/admin/usuarios' ]}>
              <PrivateLayout>
                <Switch>
                  <Route path='/admin/proyectos'>
                    <Proyectos/>
                  </Route>  
                  <Route path='/admin/usuarios'>
                    <Usuarios/>
                  </Route>
                  <Route path='/admin/avances'>
                    <Avances/>
                  </Route>
                  <Route path='/admin'>
                    <Admin />
                  </Route>
                </Switch>
              </PrivateLayout>
            </Route>

              <Route exact path={['/']}>
                <PublicLayout>
                  <Route exact path='/'>
                    <Index />
                  </Route>
              </PublicLayout>
              </Route>
                
              <Route path={['*']}>
                <AuthLayout>
                  <Route path='*'>
                    <Error404/>
                  </Route>
                </AuthLayout>
              </Route>

            </Switch>
          </Router>
        </UserContext.Provider>
      </div>
    </Auth0Provider>
  );
}

export default App;
