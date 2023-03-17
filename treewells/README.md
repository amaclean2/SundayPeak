# SundayPeak Treewells

This library is supposed to abstract out all of the hooks and serverside calls from the SundayPeak UI
To set it up first set:

```Javascript
SundayPeakServerUrls = {
  serverUrl // points to your server
  websocketUrl // points to your websocket
}
```

Providers should be able to be accesses through `<SundayPeakProviders />` which takes `{children}` as a parameter
All the hooks should be exposed through whatever hook you need.

- Testing will come later.
- I'm not sure how to test a bunch of providers
