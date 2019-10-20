import SpotifyWebApi from 'spotify-web-api-node'

const AUTH_SCOPES = ["playlist-read-private", "playlist-modify-private", "playlist-modify-public"]

let api = new SpotifyWebApi({
  clientId: '61f6168aed9743a498f1daccc502d0e2',
  redirectUri: `${window.location.protocol}//${window.location.host}${window.location.pathname}`
})
let authURL = new URL(api.createAuthorizeURL(AUTH_SCOPES, ''))
authURL.searchParams.set('response_type', 'token')

export default {
  data () {
    return { api, AUTH_URL: authURL.href }
  }
}
