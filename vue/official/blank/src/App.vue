<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';

export default {
  setup() {
    return { IonApp, IonRouterOutlet }
  }
};
</script>