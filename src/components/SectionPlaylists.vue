<template>
  <section class="section">
    <div class="columns">
      <div class="column">
        <div class="level">
          <h2 class="title">Tracked Playlists</h2>
          <span></span>
        </div>
        <Table class="is-fullwidth" :fields="fields" :items="trackedPlaylists">
          <template v-slot:image="slotProps">
            <img :src="slotProps.item.image" class="image" />
          </template>
          <template v-slot:action="slotProps">
            <button
              class="button is-primary"
              @click="$store.commit('setState', {key: 'activePlaylist', value: slotProps.itemIndex})"
            >Edit</button>
          </template>
        </Table>
      </div>
      <div class="column">
        <div class="level">
          <h2 class="title">Your Playlists</h2>
          <button
            class="button is-primary"
            @click="$store.dispatch('refreshUserPlaylists', api)"
          >Refresh</button>
        </div>
        <Table class="is-fullwidth" :fields="fields" :items="ownedPlaylists">
          <template v-slot:image="slotProps">
            <img :src="slotProps.item.image" alt="Playlist Cover Image" class="image" />
          </template>
          <template v-slot:action="slotProps">
            <button
              class="button is-primary"
              @click="$store.dispatch('importPlaylist', {api, playlistID: slotProps.itemIndex})"
            >Import</button>
          </template>
        </Table>
      </div>
    </div>
  </section>
</template>

<script>
import spotifyMixin from "./mixins/spotify.js";
import Table from "./Table";

export default {
  name: "SectionPlaylists",
  mixins: [spotifyMixin],
  data() {
    return {
      fields: { image: "Cover Image", name: "Name", action: "Action" },
      trackedPlaylists: {},
      ownedPlaylists: {}
    };
  },
  methods: {
    splitPlaylists(playlists) {
      let trackedPlaylists = {};
      let ownedPlaylists = {};
      for (let key in playlists) {
        (playlists[key].tracked ? trackedPlaylists : ownedPlaylists)[key] =
          playlists[key];
      }
      return [trackedPlaylists, ownedPlaylists];
    }
  },
  created() {
    [this.trackedPlaylists, this.ownedPlaylists] = this.splitPlaylists(
      this.$store.state.playlists
    );
    this.$store.watch(
      state => {
        return state.playlists;
      },
      playlists => {
        [this.trackedPlaylists, this.ownedPlaylists] = this.splitPlaylists(
          playlists
        );
      },
      {
        deep: true
      }
    );
  },
  components: { Table }
};
</script>
