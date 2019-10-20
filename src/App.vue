<template>
  <div id="app">
    <SectionHero v-if="!$store.state.token" />
    <div v-if="$store.state.token">
      <Navbar />
      <SectionPlaylists />
      <SectionPlaylistEdit v-if="$store.state.activePlaylist" />
    </div>
    <LoadingScreen />
    <AuthHandler />
    <Alerts />
  </div>
</template>

<script>
import SectionHero from "./components/SectionHero.vue";
import Navbar from "./components/Navbar.vue";
import SectionPlaylists from "./components/SectionPlaylists.vue";
import SectionPlaylistEdit from "./components/SectionPlaylistEdit.vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import AuthHandler from "./components/AuthHandler.vue";
import Alerts from "./components/Alerts.vue";

export default {
  name: "app",
  components: {
    LoadingScreen,
    AuthHandler,
    Navbar,
    SectionHero,
    SectionPlaylists,
    SectionPlaylistEdit,
    Alerts
  }
};
</script>
