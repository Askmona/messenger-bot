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
| toggle                         | Boolean           | Default: true - Toggles the typing   |

**Returns:** Promise

### send
Sends a message/object to the recipient

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| recipient                      | String            | Ex: "14335981239"    |
| data                           | Any               | Data to post         |
| options                        | Object            | Optional: Merges with data |

**Returns:** Promise

### sendAttachment
Sends an attachment to the recipient

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| recipient                      | String            | Ex: "14335981239"    |
| type                           | String            | Attachment type ("image", "audio", "video", "file) |
| url                            | String            | URL of attachment    |

**Returns:** Promise

### sendImage
Sends an image to the recipient

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| recipient                      | String            | Ex: "14335981239"    |
| url                            | String            | URL of the image     |

**Returns:** Promise

### sendAudio
Sends an audio to the recipient

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| recipient                      | String            | Ex: "14335981239"    |
| url                            | String            | URL of the audio     |

**Returns:** Promise

### sendVideo
Sends a video to the recipient

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| recipient                      | String            | Ex: "14335981239"    |
| url                            | String            | URL of the video     |

**Returns:** Promise

### sendFile
Sends a file to the recipient

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| recipient                      | String            | Ex: "14335981239"    |
| url                            | String            | URL of the file      |

**Returns:** Promise

### post
Sends a raw post to the graphql api

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| endpoint                       | String            | Ex: "me/messages"    |
| data                           | Object            | Data to post         |

**Returns:** Promise

### get
Gets a raw request from the graphql api

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| endpoint                       | String            | Ex: "me/messages"    |

**Returns:** Promise