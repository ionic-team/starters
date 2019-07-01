import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import { IonApp, IonPage, IonReactRouter, IonRouterOutlet } from '@ionic/react';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/core/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/core/css/normalize.css';
import '@ionic/core/css/structure.css';
import '@ionic/core/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/core/css/padding.css';
import '@ionic/core/css/float-elements.css';
import '@ionic/core/css/text-alignment.css';
import '@ionic/core/css/text-transformation.css';
import '@ionic/core/css/flex-utils.css';
import '@ionic/core/css/display.css';

const App: React.FunctionComponent = () => (
  <Router>
    <IonApp>
      <IonReactRouter>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <IonPage>
          <IonRouterOutlet>
            <Route path="/:tab(home)" component={Home} exact={true} />
          </IonRouterOutlet>
        </IonPage>
      </IonReactRouter>
    </IonApp>
  </Router>
);

export default App;
