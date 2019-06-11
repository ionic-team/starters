import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { IonApp, IonSplitPane, IonPage, IonRouterOutlet } from '@ionic/react';
import { AppPage } from './declarations';

import Menu from './components/Menu';
import Home from './pages/Home';
import List from './pages/List';

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

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    icon: 'home'
  },
  {
    title: 'List',
    url: '/home/list',
    icon: 'list'
  }
];


const App: React.SFC = () => (
  <Router>
    <Route exact path="/" render={() => <Redirect to="/home"/>} />
    <div className="App">
      <IonApp>
        <IonSplitPane contentId="main">
          <Menu appPages={appPages}/>
          <IonPage id="main">
            <IonRouterOutlet>
              <Route path="/:tab(home)" component={Home} exact={true} />
              <Route path="/:tab(home)/list" component={List} exact={true} />
            </IonRouterOutlet>
          </IonPage>
        </IonSplitPane>
      </IonApp>
    </div>
  </Router>
);

export default App;
