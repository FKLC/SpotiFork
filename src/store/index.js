import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingScreenMessage: '',
    token: JSON.parse(localStorage['token'] || '{}'),
    alerts: [],
    playlists: JSON.parse(localStorage['playlists'] || '{}'),
    sourcePlaylists: JSON.parse(localStorage['sourcePlaylists'] || '{}'),
    activePlaylist: ''
  },
  mutations: {
    setState (state, { key, value, updateLocalStorage = false }) {
      state[key] = value
      if (updateLocalStorage)
        localStorage[key] = JSON.stringify(value)
    },
    setStateProperty (state, { key, propertyKey, value, updateLocalStorage = false }) {
      state[key][propertyKey] = value
      if (updateLocalStorage)
        localStorage[key] = JSON.stringify(state[key])
    },
    delStateProperty (state, { key, propertyKey, updateLocalStorage = false }) {
      delete state[key][propertyKey]
      if (updateLocalStorage)
        localStorage[key] = JSON.stringify(state[key])
    },
    pushToState (state, { key, value, updateLocalStorage = false }) {
      state[key].push(value)
      if (updateLocalStorage)
        localStorage[key] = JSON.stringify(value)
    },
    removeFromState (state, { key, index, updateLocalStorage = false }) {
      state[key].splice(index, 1)
      if (updateLocalStorage)
        localStorage[key] = JSON.stringify(value)
    },
  },
  actions: {
    refreshUserPlaylists ({ state, commit }, api) {
      commit("setState", { key: "loadingScreenMessage", value: "Refresing Playlists..." });
      api
        .getUserPlaylists({
          fields: "items(id, name, images)",
          limit: 50
        })
        .then(
          playlists => {
            playlists = playlists.body.items.map(playlist => {
              return { id: playlist.id, name: playlist.name, image: playlist.images.length ? playlist.images[0].url : '' }
            });
            commit("setState", { key: "playlists", value: playlists.reduce((map, playlist) => (map[playlist.id] = { ...state.playlists[playlist.id], name: playlist.name, image: playlist.image, sources: [], blacklist: [] }, map), {}), updateLocalStorage: true })
            commit("setState", { key: "loadingScreenMessage", value: "" });
          },
          error => {
            commit("pushToState", {
              key: "alerts", value: {
                message: error.message,
                type: "danger"
              }
            });
            commit("setState", { key: "loadingScreenMessage", value: "" });
          }
        );
    },
    async importPlaylist ({ state, commit }, { api, playlistID }) {
      commit("setState", { key: "loadingScreenMessage", value: "Importing Playlist..." });
      let next = 0, updatedPlaylist = { tracks: [], tracked: true };
      while (next + 1) {
        let { body } = await api.getPlaylistTracks(playlistID, {
          offset: next,
          fields: "items(track(id, name)), next"
        });
        updatedPlaylist.tracks.push(
          ...body.items.map(item => {
            return { id: item.track.id, name: item.track.name };
          })
        );
        next += body.next ? 100 : undefined;
      }
      commit("setStateProperty", { key: "playlists", propertyKey: playlistID, value: { ...state.playlists[playlistID], ...updatedPlaylist }, updateLocalStorage: true });
      commit("setState", { key: "loadingScreenMessage", value: "" });
    },
    async importSourcePlaylist ({ state, commit }, { api, playlistID }) {
      commit("setState", { key: "loadingScreenMessage", value: "Importing Source Playlist..." });
      let playlist = (await api.getPlaylist(playlistID, {
        fields: "name, images"
      })).body
      let next = 0, updatedPlaylist = { name: playlist.name, image: playlist.images.length ? playlist.images[0].url : '', tracks: [] };
      while (next + 1) {
        let { body } = await api.getPlaylistTracks(playlistID, {
          offset: next,
          fields: "items(track(id, name)), next"
        });
        updatedPlaylist.tracks.push(
          ...body.items.map(item => {
            return { id: item.track.id, name: item.track.name };
          })
        );
        next += body.next ? 100 : undefined;
      }
      commit("setStateProperty", { key: "sourcePlaylists", propertyKey: playlistID, value: { ...state.sourcePlaylists[playlistID], ...updatedPlaylist }, updateLocalStorage: true });
      commit("setState", { key: "loadingScreenMessage", value: "" });
    },
    addSourcePlaylist ({ state, dispatch, commit }, { api, playlistID }) {
      dispatch("importSourcePlaylist", { api, playlistID }).then(() => {
        commit("setStateProperty", {
          key: "playlists", propertyKey: state.activePlaylist, value: {
            ...state.playlists[state.activePlaylist], sources: [...new Set([playlistID, ...(state.playlists[state.activePlaylist].sources)])]
          }, updateLocalStorage: true
        });
      })
    },
    removeSourcePlaylist ({ state, commit }, sourcePlaylistID) {
      commit('setStateProperty', { key: 'playlists', propertyKey: state.activePlaylist, value: { ...state.playlists[state.activePlaylist], sources: state.playlists[state.activePlaylist].sources.filter(source => source !== sourcePlaylistID) }, updateLocalStorage: true });
    },
    addToBlacklist ({ state, commit }, trackID) {
      commit('setStateProperty', { key: 'playlists', propertyKey: state.activePlaylist, value: { ...state.playlists[state.activePlaylist], blacklist: [...state.playlists[state.activePlaylist].blacklist, trackID] }, updateLocalStorage: true });
    },
    addToPlaylist ({ state, commit }, { track, api }) {
      api.addTracksToPlaylist(state.activePlaylist, [`spotify:track:${track.id}`])
      commit('setStateProperty', { key: 'playlists', propertyKey: state.activePlaylist, value: { ...state.playlists[state.activePlaylist], tracks: [...state.playlists[state.activePlaylist].tracks, track] }, updateLocalStorage: true });
    }
  }
})
