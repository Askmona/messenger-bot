# Client

## Events

### message
Emitted whenever a message is sent

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| message                        | [Message](message.md) | Message is sent      |

### postback
Emitted whenever a postback (can be a quick_reply witch a payload) is sent

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| postback                        | [Postback](postback.md) | Postback is sent      |

## Methods

### typing
Toggles the typing action

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| sender_id                      | ID                | The ID of the sender |
| switch                         | Boolean           | Toggles the typing   |
**Returns:** Promise

### post
Sends a raw post to the graph-api

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| endpoint                       | String            | Ex: "me/messages"    |
| data                           | Object            | Data to post         |
**Returns:** Promise