// This implementation is based on https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps

// Implicit flow requires responseType "token"
const RESPONSE_TYPE = 'token'

/**
 * OAuth2.0 Implicit Grant authorization module.
 */
export default class OAuth2ImplicitGrant {
  /**
   * @typedef {Object} ClientAuthInit
   * @property {string} clientId
   * @property {string} redirectUrl
   * @property {string[]} scope
   * @property {string?} state
   * @param {ClientAuthInit} init
   */
  static forGoogleApi (init) {
    return new OAuth2ImplicitGrant({
      getTokenUrl: 'https://accounts.google.com/o/oauth2/auth',
      verifyTokenUrl: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
      revokeTokenUrl: 'https://accounts.google.com/o/oauth2/revoke',
      ...init
    })
  }

  /**
   * @typedef {Object} AuthInit
   * @property {string} getTokenUrl
   * @property {string} verifyTokenUrl
   * @property {string} revokeTokenUrl
   * @property {string} clientId
   * @property {string} redirectUrl
   * @property {string[]} scope
   * @property {string?} state
   * @param {AuthInit} init
   */
  constructor (init) {
    this.getTokenUrl = init.getTokenUrl
    this.verifyTokenUrl = init.verifyTokenUrl
    this.revokeTokenUrl = init.revokeTokenUrl
    this.clientId = init.clientId
    this.redirectUrl = init.redirectUrl
    this.scope = init.scope
    this.state = init.state
    this.userId = null
  }

  /**
   * Return true if Authorized.
   * @returns {boolean}
   */
  get isAuthorized () {
    return !!this.token
  }

  /**
   * Check the token exists.
   * If the token does not exists, this method do nothing.
   * please invoke "getToken" method for login.
   *
   * If the token exists, verify the token has expired.
   * And then, if the token is not expired, invoke "onLogin".
   * Otherwise, invoke "onDenied" event.
   * @return {Promise<boolean>}
   */
  async init ({ onLogin, onDenied }) {
    const url = window.location.href
    if (url.startsWith(this.redirectUrl)) {
      const param = new URLSearchParams('?' + window.location.hash.substring(1))
      if (param.has('error')) {
        onDenied(param.get('error'))
        return false
      }
      // Check state.
      if (this.state) {
        if (this.state !== param.get('state')) {
          onDenied(`different state. expected:${this.state}, but:${param.get('state')}`)
          return false
        }
      }
      const token = param.get('access_token')
      this.saveToken(token)
      onLogin()
      return true
    }

    const token = this.getTokenFromLocalStorage()
    if (token) {
      return await this.verifyToken(token, onDenied)
    }

    return false
  }

  async verifyToken (token, onDenied) {
    const response = await fetch(`${this.verifyTokenUrl}?access_token=${token}`)
    const { audience, error } = await response.json()

    if (error) {
      this.saveToken(null)
      onDenied(error)
      return false
    }

    if (audience !== this.clientId) {
      this.saveToken(null)
      onDenied(`audience is invalid: ${audience}`)
      return false
    }

    // this.userId = userid

    if (token) {
      this.saveToken(token)
    }
    return true
  }

  saveToken (token) {
    this.token = token
    localStorage.setItem('access_token', token)
  }

  getTokenFromLocalStorage () {
    const token = localStorage.getItem('access_token')
    this.token = token
    return token
  }

  /**
   * Go to the login page for get token.
   */
  async getToken () {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      response_type: RESPONSE_TYPE,
      scope: this.scope.join(',')
    })

    if (this.state) params.append('state', this.state)

    // console.log(`${GET_TOKEN_URL}?${params.toString()}`)
    window.location.href = `${this.getTokenUrl}?${params.toString()}`
  }

  /**
   * Disable current token.
   */
  async revokeToken () {
    if (!this.token) return

    const params = new URLSearchParams({
      token: this.token
    })
    await fetch(`${this.revokeTokenUrl}?${params.toString()}`)
  }

  /**
   *
   * @param {string} url
   * @param {RequestInit} init
   * @returns {Promise<Response}
   */
  async proxyFetch (url, init = {}) {
    init.headers = {
      ...init.headers || {},
      Authorization: `Bearer ${this.token}`
    }
    return await fetch(url, init)
  }
}
