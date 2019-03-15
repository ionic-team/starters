import { IonApp, IonPage, IonSplitPane } from '@ionic/react';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Menu from './components/Menu';
import './globals.scss';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import './theme/variables.scss';

const App: React.SFC<any> = () => {

  return (
    <Router>
      <IonApp>
        <IonSplitPane contentId="main">
          <Menu />
          <IonPage id="main">
            <Switch>
              <Route path="/home" component={HomePage} />
              <Route path="/list" component={ListPage} />
              <Redirect exact path="/" to="/home" />
            </Switch>
          </IonPage>
        </IonSplitPane>
      </IonApp>
    </Router>
  );
};

export default App;
