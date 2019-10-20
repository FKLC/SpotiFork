<template>
  <section ref="sectionTop" class="section">
    <div class="columns">
      <div class="column">
        <div class="level">
          <h3 class="title">Tracks</h3>
          <button
            class="button is-primary"
            @click="$store.dispatch('importPlaylist', {playlistID: $store.state.activePlaylist, api})"
          >Refresh Playlist</button>
        </div>
        <Table :fields="tracksFields" :items="trackPool[0]">
          <template v-slot:name="slotProps">
            <a @click="() => { preview = slotProps.item.id }">{{ slotProps.item.name }}</a>
          </template>
          <template v-slot:preview="slotProps">
            <iframe
              v-if="preview == slotProps.item.id"
              :src="'https://open.spotify.com/embed/track/' + slotProps.item.id"
              width="250"
              height="80"
              frameborder="0"
              allowtransparency="true"
              allow="encrypted-media"
            ></iframe>
          </template>
          <template v-slot:action="slotProps">
            <div class="buttons" v-if="trackPool[1] > slotProps.itemIndex">
              <button
                class="button is-success"
                @click="$store.dispatch('addToPlaylist', {track: slotProps.item, api})"
              >✓</button>
              <button
                class="button is-warning"
                @click="$store.dispatch('addToBlacklist', slotProps.item.id)"
              >X</button>
            </div>
          </template>
        </Table>
      </div>
      <div class="column">
        <div class="level">
          <h2 class="title">Source Playlists</h2>
          <span></span>
        </div>
        <Table class="is-fullwidth" :fields="sourcesFields" :items="sources">
          <template v-slot:image="slotProps">
            <img :src="slotProps.item.image" class="image" />
          </template>
          <template v-slot:action="slotProps">
            <div class="buttons">
              <button
                class="button is-primary"
                @click="$store.dispatch('importSourcePlaylist', { api, playlistID: slotProps.itemIndex})"
              >Refresh</button>
              <button
                class="button is-warning"
                @click="$store.dispatch('removeSourcePlaylist', slotProps.itemIndex)"
              >Remove</button>
            </div>
          </template>
        </Table>
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input
              class="input"
              type="text"
              v-model="sourcePlaylistURL"
              placeholder="Playlist Link"
            />
          </p>
          <p class="control">
            <button class="button is-info" @click="addSourcePlaylist">Add Source Playlist</button>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import spotifyMixin from "./mixins/spotify.js";
import Table from "./Table";

export default {
  name: "SectionPlaylistEdit",
  mixins: [spotifyMixin],
  components: { Table },
  data() {
    return {
      tracksFields: { name: "Name", preview: "Preview", action: "Action" },
      sourcesFields: { image: "Image", name: "Name", action: "Action" },
      sourcePlaylistURL: "",
      preview: []
    };
  },
  computed: {
    activePlaylist() {
      return (
        this.$store.state.playlists[this.$store.state.activePlaylist] || {}
      );
    },
    sources() {
      this.$store.state.sourcePlaylists;
      return this.activePlaylist.sources.reduce(
        (playlists, playlist) => (
          (playlists[playlist] = this.$store.state.sourcePlaylists[playlist]),
          playlists
        ),
        {}
      );
    },
    trackPool() {
      let newTracks = Object.keys(this.sources)
        .map(playlist =>
          this.sources[playlist].tracks.filter(
            track =>
              !this.activePlaylist.tracks.some(
                aTrack => aTrack.id == track.id
              ) && !this.activePlaylist.blacklist.includes(track.id)
          )
        )
        .flat();
      return [[...newTracks, ...this.activePlaylist.tracks], newTracks.length];
    }
  },
  methods: {
    addSourcePlaylist() {
      let [, type, playlistID] = new URL(this.sourcePlaylistURL).pathname.split(
        "/"
      );
      if (type != "playlist" || !playlistID) {
        this.$store.commit("pushToState", {
          key: "alerts",
          value: {
            message: "Please enter a valid Spotify playlist link",
            type: "danger"
          }
        });
        return;
      }
      this.$store.dispatch("addSourcePlaylist", { api: this.api, playlistID });
    }
  },
  mounted() {
    this.$refs.sectionTop.scrollIntoView({ behavior: "smooth" });
  },
  updated() {
    this.$refs.sectionTop.scrollIntoView({ behavior: "smooth" });
  }
};
</script>
