<template>
  <div v-show="$store.state.loadingScreenMessage" class="loading-screen">
    <h3 class="title is-3">{{ $store.state.loadingScreenMessage }}</h3>
  </div>
</template>


<script>
export default {
  name: "LoadingScreen"
};
</script>
