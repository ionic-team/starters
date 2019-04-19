import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Home: React.SFC<any> = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent padding>
        The world is your oyster.
        <p>
          If you get lost, the{' '}
          <a target="_blank" rel="noopener" href="https://ionicframework.com/docs/">
            docs
          </a>{' '}
          will be your guide.
        </p>
      </IonContent>
    </>
  );
};

export default Home;