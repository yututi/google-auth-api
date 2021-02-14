# Web client library for OAuth2.0 implicit grant

This library is **reinventing the wheel** for my own use.  
You can find a better module.

## Prep work
1. [Create your OAuth2.0 Client ID](https://console.cloud.google.com/apis/credentials)

## Installation
```
npm i oauth2-implicitgrant
```

## How to use

```js
import OAuth2ImplicitGrant from "oauth2-implicitgrant"

const auth = OAuth2ImplicitGrant.forGoogleApi({
  clientId: 'your client id that created above.',
  redirectUrl: 'your redirect url',
  scope: ['scopes that you want']
})

auth.init({
  onDenied: () => {
    // Something happen in authorization flow or token was expired.
    // should route to login view.
  }
}).then(isLoggedIn => {
  if(isLoggedIn) {
    // if once logged in, you can access api via "proxyFetch" method
    auth.proxyFetch(`https://www.googleapis.com/youtube/v3/subscriptions?${new URLSearchParams({
      part: "snippet",
      mine: true
    }).toString()}`)
      .then(response => response.json())
      .then(json => console.log(json))
  } else {
    // should route to login view.
  }
})

const doLogin = {
  // Go to authentication page.
  auth.getToken()
}

```

## Docs
[here](https://yututi.github.io/oauth2-implicitgrant/)
