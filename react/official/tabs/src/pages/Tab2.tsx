import React from 'react';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Tab2: React.FunctionComponent<RouteComponentProps> = ({ history }) => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab Two</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem href="/tab2/details">
            <IonLabel>
              <h2>Go to detail</h2>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;