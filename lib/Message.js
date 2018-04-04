const User = require("./User")

class Attachment {
    constructor(data) {
        this.title = data.title
        this.type = data.type
        this.image_url = data.image_url
        this.payload = data.payload
    }
}

class Message {

    constructor(client, event, cb) {
        this.client = client
        if (event) {
            this.mid = event.message.mid
            this.recipient = event.recipient.id
            this.timestamp = event.timestamp
            if (event.message.text) {
                this.type = "text"
                this.text = event.message.text
            } else if (event.message.sticker_id) {
                this.type = "sticker"
                this.sticker_id = event.message.sticker_id
                this.attachments = event.message.attachments
            } else if (event.message.attachments) {
                this.type = "attachments"
                this.attachments = []
                event.message.attachments.forEach(el => {
                    this.attachments.push(new Attachment(el))
                })
            } else {
                return
            }
            this.sender = new User(this.client, event.sender.id, () => cb(this))
        }
    }
}

module.exports = Message