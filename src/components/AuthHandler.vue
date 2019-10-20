<script>
import spotifyMixin from "./mixins/spotify.js";

export default {
  name: "AuthHandler",
  mixins: [spotifyMixin],
  mounted() {
    if (this.$store.state.token) {
      this.api.setAccessToken(this.$store.state.token);
      this.$store.commit("setState", {
        key: "loadingScreenMessage",
        value: "Checking if token is still valid..."
      });
      this.api.getMe().then(
        _ =>
          this.$store.commit("setState", {
            key: "loadingScreenMessage",
            value: ""
          }),
        _ => {
          this.$store.commit("setState", {
            key: "token",
            value: "",
            updateLocalStorage: true
          });
          this.$store.commit("setState", {
            key: "loadingScreenMessage",
            value: ""
          });
        }
      );
      return;
    }

    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("error")) {
      this.$store.commit("pushToState", {
        key: "alerts",
        value: {
          message: `Authorization Failed. Reason: ${searchParams.get("error")}`,
          type: "danger"
        }
      });
      return;
    }

    let fragmentParams = {};
    window.location.hash
      .substring(1)
      .split("&")
      .forEach(param => {
        let [key, value] = param.split("=");
        fragmentParams[key] = value;
      });
    if (fragmentParams.hasOwnProperty("access_token")) {
      window.location.hash = "";
      this.$store.commit("setState", {
        key: "token",
        value: fragmentParams["access_token"],
        updateLocalStorage: true
      });
      this.api.setAccessToken(fragmentParams["access_token"]);
      this.$store.dispatch("refreshUserPlaylists", this.api);
    }
  },
  render() {
    return null;
  }
};
</script>
