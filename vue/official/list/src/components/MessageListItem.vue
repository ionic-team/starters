<template>
  <ion-item v-if="message" :routerLink="'/message/' + message.id" :detail="false" class="list-item">
    <div slot="start" :class="!message.read ? 'dot dot-unread' : 'dot'"></div>
    <ion-label class="ion-text-wrap">
      <h2>
        {{ message.fromName }}
        <span class="date">
          <ion-note>{{ message.date }}</ion-note>
          <ion-icon :icon="chevronForward" size="small" v-if="isIos()"></ion-icon>
        </span>
      </h2>
      <h3>{{ message.subject }}</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </ion-label>
  </ion-item>
</template>

<script lang="ts">
import { IonIcon, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';
import { defineComponent } from 'vue';

import './MessageListItem.css';

export default defineComponent({
  name: 'MessageListItem',
  components: {
    IonIcon,
    IonItem,
    IonLabel,
    IonNote,
  },
  props: {
    message: Object,
  },
  methods: {
    isIos: () => {
      const win = window as any;
      return win && win.Ionic && win.Ionic.mode === 'ios';
    }
  },
  data() {
    return { chevronForward }
  }
});
</script>
