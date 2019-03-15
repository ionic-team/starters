import { IonApp } from '@ionic/react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './globals.scss';
import './theme/variables.scss';
import { Home } from './pages/Home';

const App: React.SFC<any> = () => {
  return (
    <IonApp>
      <Router>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </IonApp>
  );
};

export default App;
