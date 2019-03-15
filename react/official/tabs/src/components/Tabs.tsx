import React from 'react';
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { Tab1Page } from '../pages/Tab1Page';
import { Tab2Page } from '../pages/Tab2Page';
import { Tab3Page } from '../pages/Tab3Page';

export const Tabs: React.SFC<RouteComponentProps> = ({match}) => {
  return (
    <IonPage>
      <Route exact path={`${match.url}`} render={() => <Redirect to="/tabs/tab1"/>}/>
      <IonTabs>
        <IonRouterOutlet>
          <Route path={`${match.url}/:tab(tab1)`} component={Tab1Page} exact={true} />
          <Route path={`${match.url}/:tab(tab2)`} component={Tab2Page} exact={true} />
          <Route path={`${match.url}/:tab(tab3)`} component={Tab3Page} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href={`${match.url}/tab1`}>
            <IonIcon name="flash" />
            <IonLabel>Tab One</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href={`${match.url}/tab2`}>
            <IonIcon name="apps" />
            <IonLabel>Tab Two</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href={`${match.url}/tab3`}>
            <IonIcon name="send" />
            <IonLabel>Tab Three</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  );
};
