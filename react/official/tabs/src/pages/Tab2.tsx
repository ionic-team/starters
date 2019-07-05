import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/react';

const Tab2: React.FunctionComponent<RouteComponentProps> = ({ history }) => {

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab Two</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <Link to="/tab2/details">
            <IonItem>
              <IonLabel>
                <h2>Go to detail</h2>
              </IonLabel>
            </IonItem>
          </Link>
        </IonList>
      </IonContent>
    </>
  );
};

export default Tab2;
