# User

## Properties

### id
User's unique ID  
**Type:** Int

### first_name
User's first name  
**Type:** String

### last_name
User's last name  
**Type:** String

### profile_pic
User's profile picture  
**Type:** String

### locale
User's language  
**Type:** String

### timezone
UTC +timezone  
**Type:** Int

### gender
User's gender  
**Type:** String

## Methods

### fullname
Returns first_name + last_name with a white space between

### send
Sends a message

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| value                          | String, Number, Object | Any value       |
| options / callback             | Object / Function | Optional             |
| callback                       | Function          | Optional             |

### sendAttachment
Sends an attachment to the user

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| type                           | String            | Attachment type ("image", "audio", "video", "file) |
| url                            | String            | URL of attachment    |

**Returns:** Promise

### sendImage
Sends an image to the user

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| url                            | String            | URL of the image     |

**Returns:** Promise

### sendAudio
Sends an audio to the user

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| url                            | String            | URL of the audio     |

**Returns:** Promise

### sendVideo
Sends a video to the user

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| url                            | String            | URL of the video     |

**Returns:** Promise

### sendFile
Sends a file to the user

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| url                            | String            | URL of the file      |

**Returns:** Promise