import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonImg, IonCardHeader, IonCardContent, IonList, IonListHeader, IonItem, IonLabel, IonIcon } from '@ionic/react';
import './Tab1.css';

const Tab1 = () => (
  <>
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          Tab One
        </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonCard class="welcome-card">
        <IonImg src="/assets/shapes.svg" />
        <IonCardHeader>
          <IonCard-subtitle>Get Started</IonCard-subtitle>
          <IonCard-title>Welcome to Ionic</IonCard-title>
        </IonCardHeader>
        <IonCardContent>
          <p>Now that your app has been created, you'll want to start building out features and components. Check out some of the resources below for next steps.</p>
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

export default Tab1;
