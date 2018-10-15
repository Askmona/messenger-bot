const User = require("./User")

class Postback {

    constructor(client, event = null, cb) {
        this.client = client
        if (event) {
            this.recipient = event.recipient.id
            this.timestamp = event.timestamp
            this.payload = (event.postback) ? event.postback.payload : event.message.quick_reply.payload
            this.title = (event.postback) ? event.postback.title : event.message.text
            
            if(!event.sender)
                this.sender = new User(this.client, event.recipient.id, () => cb(this), true)
            else
                this.sender = new User(this.client, event.sender.id, () => cb(this))

        }
    }
}

module.exports = Postback