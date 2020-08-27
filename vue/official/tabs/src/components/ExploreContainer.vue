<template>
  <div id="container">
    <strong>{{ name }}</strong>
    <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
  </div>
</template>

<script lang="ts">
import './ExploreContainer.css';

export default {
  name: 'ExploreContainer',
  props: {
    name: String
  }
}
</script>