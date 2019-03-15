import { IonApp } from '@ionic/react';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Tabs } from './components/Tabs';
import './globals.scss';
import './theme/variables.scss';

const App: React.SFC<any> = () => {
  return (
    <IonApp>
      <Router>
        <Switch>
          <Route path="/tabs" component={Tabs} />
          <Redirect path="/" to="/tabs" />
        </Switch>
      </Router>
    </IonApp>
  );
};

export default App;
