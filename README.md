# OAuth2.0 implicit grant module
WIP.

This module is **reinventing the wheel**.  
You can find a better module.

## Prep work
1. [Create your OAuth2.0 Client ID](https://console.cloud.google.com/apis/credentials)

## How to use
```js
const auth = OAuth2ImplicitGrant.forGoogleApi({
  clientId: 'your client id that created above.',
  redirectUrl: 'your redirect url',
  scope: ['scopes that you want']
})

auth.init({
  onLogin: () => {
    // should route to authorized home view.
  },
  onDenied: () => {
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
```

## Docs
[here](https://yututi.github.io/youtube-data-api-web-client/)
