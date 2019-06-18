import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AppPage } from '../declarations';

type Props = RouteComponentProps<{}> & {
  appPages: AppPage[]
};

const Menu: React.SFC<Props> = ({ history, appPages }) => (
  <IonMenu contentId="main" type="overlay">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Menu</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="outer-content">
      <IonList>
        {appPages.map((appPage, index) => {
          return (
            <IonMenuToggle key={index}>
              <IonItem routerDirection="root" onClick={() => history.push(appPage.url)}>
                <IonIcon slot="start" name={appPage.icon} />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          );
        })}
      </IonList>
    </IonContent>
  </IonMenu>
);

export default withRouter(Menu);
