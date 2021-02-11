# Youtube Data API client for web
WIP.

This module is **reinventing the wheel**.  
You can find a better module.

## Prep work
1. [Create your OAuth2.0 Client ID](https://console.cloud.google.com/apis/credentials)

## How to use
```js
const auth = new Auth({
  clientId: 'your client id that created above.',
  redirectUrl: 'your redirect url',
  scope: ['scopes that you want']
})

// Denied event.
auth.on("denied", msg => {
  alert(msg)
})

// Login event.
auth.on("login", token => {
  // Once you are logged in, you can use YoutubeApi.
  const youtubeApi = new YoutubeApi(auth)

  // Call youtube data api.
  youtubeApi.channels.list({
    part: "me"
  })
  .then(response => response.json())
  .then(json => console.log(json))
})

// Initialize authorization module.
auth.init()
```

## Docs
[here](https://yututi.github.io/youtube-data-api-web-client/)
