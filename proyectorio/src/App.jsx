import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Layouts
import PublicLayout from './layouts/PublicLayout';

//Pages
import Index from './pages/Index'



function App() {
  return (
    <div className='App'> 
      <Router>
        <Switch>

          <Route exact path={['/']}>
            <PublicLayout>
              <Route exact path='/'>
                <Index />
              </Route>
            </PublicLayout>
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
