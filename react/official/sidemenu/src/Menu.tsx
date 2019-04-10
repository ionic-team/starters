import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel } from '@ionic/react';
import { AppPage } from './declarations';

type Props = {
  appPages: AppPage[]
}

const Menu: React.SFC<Props> = ({ appPages }) => (
    <IonMenu>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          { appPages.map((p) => (
            <IonMenuToggle auto-hide="false">
              <IonItem routerDirectIon="root" routerLink={p.url}>
                <IonIcon slot="start" name={p.icon} />
                <IonLabel>
                  {p.title}
                </IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
);

export default Menu;
