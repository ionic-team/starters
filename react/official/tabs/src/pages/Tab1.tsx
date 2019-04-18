import {
  IonCard,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonImg,
  IonTitle,
  IonToolbar,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonLabel,
  IonListHeader,
  IonItem,
  IonIcon
} from '@ionic/react';
import React from 'react';
import './Tab1.css';

const Tab1: React.SFC = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab One</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard class="welcome-card">
          <IonImg src="/assets/shapes.svg" />
          <IonCardHeader>
            <IonCardSubtitle>Get Started</IonCardSubtitle>
            <IonCardTitle>Welcome to Ionic</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Now that your app has been created, you'll want to start building out features and
              components. Check out some of the resources below for next steps.
            </p>
          </IonCardContent>
        </IonCard>

        <IonList lines="none">
          <IonListHeader>
            <IonLabel>Resources</IonLabel>
          </IonListHeader>
          <IonItem href="https://ionicframework.com/docs/">
            <IonIcon slot="start" color="medium" name="book" />
            <IonLabel>Ionic Documentation</IonLabel>
          </IonItem>
          <IonItem href="https://ionicframework.com/docs/building/scaffolding">
            <IonIcon slot="start" color="medium" name="build" />
            <IonLabel>Scaffold Out Your App</IonLabel>
          </IonItem>
          <IonItem href="https://ionicframework.com/docs/layout/structure">
            <IonIcon slot="start" color="medium" name="grid" />
            <IonLabel>Change Your App Layout</IonLabel>
          </IonItem>
          <IonItem href="https://ionicframework.com/docs/theming/basics">
            <IonIcon slot="start" color="medium" name="color-fill" />
            <IonLabel>Theme Your App</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </>
  );
};

export default Tab1;