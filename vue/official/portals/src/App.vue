<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { getInitialContext } from '@ionic/portals';

const initialContext = getInitialContext<any>();
</script>
