# Orginazation of the Messaging App

## Watch /users/<user_id>/conversations

### If the user doesn't exist initiate them

- initiated with properties

```javascript
{
  active_conversation: false,
  conversations: false,
  email,
  name,
  profile_picture_url
}
```

### Get conversation keys from the user object

- for each conversation key, get the conversation name, key, is_read, and last_message
- store `conversations` as an object, not an array, because we need to access them by key later
- set those to `conversations`
- when the conversation with the active_conversation key is passed, store that key in `currentConversation`

### If there is a key in `currentConversation`, store the messages attributed to that conversation in `conversationMessages`

- Change conversations/<currentConversation>/isRead/<userId> to true

## Create a new message thread

### If the 'message user' button is pressed in the recepient's profile or a new message thread is created in

the conversations panel, create a new conversation between those parties

- a new conversation has to be created with properties

```javascript
{
  image: recepients profile image,
  last_message,
  members: the members added to the conversation as a key-value pair with the value being true,
  name: either a group of recepients or the single recepients name,
  read: false,
  timestamp: last read
}
```

- add this new conversation to the conversations property in the user object
- also add it to the conversations property in the recepient's object
- update the `conversations` object
- set this conversation to the active_conversation
- set this conversation to the `currentConversation`

### Watch for changes in conversations

- if there's a change in a conversation reflect it in `conversations` and `conversationMessages` appropriately
- if the read state of a conversation changed, reflect that as well as last_message in `conversations`

## Send a message

### Create a new message under

```javascript
{
  messages: {
    <conversation_id>: {
      <message_id>: {
        text: message content,
        user: sending user id
      }
    }
  }
}
```

### Update conversations with

```javascript
{
  read: false,
  last_message: message content,
  timestamp: current time
}
```

### Watch for changes in `messages/<conversation_id>`

- if a new message is added, update conversations/<currentConversation>/read
  and conversations/<currentConversation>/last_message
- if a new message is added, update `conversationMessages`

## Select a new active conversation

- Update active_conversation with the new conversation
- Update `currentConversation` with the new conversation

### Watch for changes in /users/<userId>/active_conversation

- Update the is_read value in the active conversation to `{ <userid>: true }`
