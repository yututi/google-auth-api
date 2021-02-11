// This implementation is refer to https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps

const RESPONSE_TYPE = 'token'
const GET_TOKEN_URL = 'https://accounts.google.com/o/oauth2/auth'
const VERIFY_TOKEN_URL = 'https://www.googleapis.com/oauth2/v1/tokeninfo'
const REVOKE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/revoke'

/**
 * OAuth module for Google API.
 */
export default class Auth {
  /**
   * @typedef {Object} AuthInit
   * @property {string} clientId
   * @property {string} redirectUrl
   * @property {string[]} scope
   * @param {AuthInit} init
   */
  constructor (init) {
    this.clientId = init.clientId
    this.redirectUrl = init.redirectUrl
    this.scope = init.scope
    this.listeners = {}
    this.userId = null
  }

  /**
   * return true if Authorized.
   * @returns {boolean}
   */
  get isAuthorized () {
    return !!this.token
  }

  /**
   * add login or denied event listener.
   * @param {"login"|"denied"} eventName
   * @param {()=>void} callback
   */
  on (eventName, callback) {
    const listeners = this.getListeners(eventName)
    listeners.push(callback)
  }

  getListeners (eventName) {
    const listeners = this.listeners[eventName] = this.listeners[eventName] || []
    return listeners
  }

  invokeListeners (eventName, eventArgs) {
    this.getListeners(eventName).forEach(listener => listener(eventArgs))
  }

  /**
   * Check the token exists.
   * If the token does not exists, this method do nothing.
   * please invoke "getToken" method for login.
   *
   * If the token exists, verify the token has expired.
   * And then, if the token is not expired, dispatch "login" event.
   * Otherwise, dispatch "denied" event.
   * @return {Promise<void>}
   */
  async init () {
    const url = window.location.href
    if (url.startsWith(this.redirectUrl)) {
      const param = new URLSearchParams('?' + window.location.hash.substring(1))
      if (param.has('error')) {
        this.invokeListeners('denied', 'access denied.')
      }
      const token = param.get('access_token')
      return await this.verifyToken(token)
    }

    const token = this.getTokenFromLocalStorage()
    if (token) {
      return await this.verifyToken(token)
    }

    // Await invocation of getToken.
  }

  async verifyToken (token) {
    const response = await fetch(`${VERIFY_TOKEN_URL}?access_token=${token}`)
    const { audience, error } = await response.json()

    if (error) {
      this.saveToken(null)
      this.invokeListeners('denied', error)
      return
    }

    if (audience !== this.clientId) {
      this.saveToken(null)
      this.invokeListeners('denied', `audience is invalid: ${audience}`)
      return
    }

    // this.userId = userid

    if (token) {
      this.saveToken(token)
    }
    this.invokeListeners('login', token)
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

    // console.log(`${GET_TOKEN_URL}?${params.toString()}`)
    window.location.href = `${GET_TOKEN_URL}?${params.toString()}`
  }

  /**
   * disable current token.
   * this cause denied event.
   */
  async revokeToken () {
    if (!this.token) return

    const params = new URLSearchParams({
      token: this.token
    })
    await fetch(`${REVOKE_TOKEN_URL}?${params.toString()}`)
    this.invokeListeners('denied', 'token revoked.')
  }

  /**
   *
   * @param {string} url
   * @param {RequestInit} init
   */
  async proxyFetch (url, init = {}) {
    init.headers = {
      ...init.headers || {},
      Authorization: `Bearer ${this.token}`
    }
    return await fetch(url, init)
  }
}
