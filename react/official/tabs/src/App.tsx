import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonReactRouter,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { apps, flash, send } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Details from './pages/Details';

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
  <IonApp>
    <IonReactRouter>
      <IonPage id="main">
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/:tab(tab1)" component={Tab1} exact={true} />
            <Route path="/:tab(tab2)" component={Tab2} exact={true} />
            <Route path="/:tab(tab2)/details" component={Details} />
            <Route path="/:tab(tab3)" component={Tab3} />
            <Route exact path="/" render={() => <Redirect to="/tab1" />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="schedule" href="/tab1">
              <IonIcon icon={flash} />
              <IonLabel>Tab One</IonLabel>
            </IonTabButton>
            <IonTabButton tab="speakers" href="/tab2">
              <IonIcon icon={apps} />
              <IonLabel>Tab Two</IonLabel>
            </IonTabButton>
            <IonTabButton tab="map" href="/tab3">
              <IonIcon icon={send} />
              <IonLabel>Tab Three</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonPage>
    </IonReactRouter>
  </IonApp>
);

export default App;
