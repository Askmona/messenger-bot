# Message

## Properties

### sender
The sender of the message  
**Type:** [User](user.md)

### timestamp
Returns the timestamp of the postback  
**Type:** Timestamp

### recipient
Returns the recipient ID  
**Type:** Int

### type
Returns the type of message (text, sticker, attachments)  
**Type:** String

### text
Returns the text if the type is text  
**Type:** String

### sticker
Returns the sticker ID if the type is sticker  
**Type:** Int

### attachments
Returns an array of attachment (stickers, gif, files, geolocation ...)  
**Type:** Array<[Attachment](attachment.md)>