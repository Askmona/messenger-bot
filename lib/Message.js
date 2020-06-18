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

            if(event.message && event.message.referral && event.message.referral.source == "CUSTOMER_CHAT_PLUGIN")
                this.ccp = true
            else if(event.message && event.message.tags && event.message.tags.source == "customer_chat_plugin")
                this.ccp = true

            if(!event.sender) {
                this.client.wc = true
                event.sender = {
                    id: event.recipient.id.split('_')[1]
                }
            } else {
                this.client.wc = false
            }

            let user = new User(this.client, event.sender.id, event.socket_id)
            this.sender = user

            cb(this)
        }
    }
}

module.exports = Message