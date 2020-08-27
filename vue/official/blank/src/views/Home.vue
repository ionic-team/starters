<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-input @ioninput="onChange($event)"></ion-input>
    
      <div id="container">
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonInput, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';
import './Home.scss';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonInput,
    IonToolbar
  },
  setup() {
    return {
      onChange: (ev: any) => {
        console.log('on change',ev)
      }
    }
  }
});
</script>