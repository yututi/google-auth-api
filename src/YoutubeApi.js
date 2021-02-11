const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export default class YoutubeApi {
  constructor (auth) {
    this.auth = auth
    this._channels = new Channels(auth)
  }

  get channels () {
    return this._channels
  }
}

class Channels {
  constructor (auth) {
    this.auth = auth
  }

  list (args) {
    return this.auth.proxyFetch(`${YOUTUBE_API_BASE}/channels?${new URLSearchParams(args).toString()}`)
  }
}
