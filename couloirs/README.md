# Websocket API for the messenger service

This plugs into the Water service provider and handles shipping an receiving messages

There will be more organization for this to come, but right now here's kinda how it works

- All requests come through the message parser in `index.js`
- Those messages are sent to `Messages.js` which finds the type (similar to `useReducer()`)
- Then it handles each message based on the type
- The response is then sent back to the websocket handler which decides what to send back to the client
