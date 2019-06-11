import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { IonApp, IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/react';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import "@ionic/core/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/core/css/normalize.css";
import "@ionic/core/css/structure.css";
import "@ionic/core/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/core/css/padding.css";
import "@ionic/core/css/float-elements.css";
import "@ionic/core/css/text-alignment.css";
import "@ionic/core/css/text-transformation.css";
import "@ionic/core/css/flex-utils.css";
import "@ionic/core/css/display.css";

const App: React.SFC = () => (
  <Router>
    <Route exact path="/" render={() => <Redirect to="/tab1"/>} />
    <div className="App">
      <IonApp>
        <IonPage id="main">
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/:tab(tab1)" component={Tab1} exact={true} />
              <Route path="/:tab(tab2)" component={Tab2} />
              <Route path="/:tab(tab3)" component={Tab3} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="schedule" href="/tab1">
                <IonIcon name="flash" />
                <IonLabel>Tab One</IonLabel>
              </IonTabButton>
              <IonTabButton tab="speakers" href="/tab2">
                <IonIcon name="apps" />
                <IonLabel>Tab Two</IonLabel>
              </IonTabButton>
              <IonTabButton tab="map" href="/tab3">
                <IonIcon name="send" />
                <IonLabel>Tab Three</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonPage>
      </IonApp>
    </div>
  </Router>
);


export default App;
