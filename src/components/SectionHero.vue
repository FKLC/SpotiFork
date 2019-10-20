<template>
  <section class="hero is-warning is-fullheight">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">SpotiFork</h1>
        <h2 class="subtitle">A client-side web app to fork multiple Spotify playlists to one!</h2>
        <a :href="AUTH_URL" class="button is-success">Login to get started</a>
      </div>
    </div>
  </section>
</template>

<script>
import spotifyMixin from './mixins/spotify.js'

export default {
  name: 'SectionHero',
  mixins: [spotifyMixin]
}
</script>
