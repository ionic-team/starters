import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IonApp, IonSplitPane, IonPage } from '@ionic/react';

import Menu from './Menu';

/* Core CSS required for Ionic components to work properly */
import "@ionic/core/css/core.css";

const App: React.SFC<any> = () => {

/* Optional CSS utils that can be commented out */
import "@ionic/core/css/padding.css";
import "@ionic/core/css/float-elements.css";
import "@ionic/core/css/text-alignment.css";
import "@ionic/core/css/text-transformation.css";
import "@ionic/core/css/flex-utils.css";
import "@ionic/core/css/display.css";
import './App.css';

const App: React.SFC = () => (
  <Router>
    <div className="App">
      <IonApp>
        <IonSplitPane contentId="main">
          <Menu />
          <IonPage id="main">
            <Switch>
              <Route path="/tutorial" component={Tutorial} />
              <Route path="/logout" />
            </Switch>
          </IonPage>
        </IonSplitPane>
      </IonApp>
    </div>
  </Router>
);

export default App;
