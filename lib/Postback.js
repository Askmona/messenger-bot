const User = require("./User")

class Postback {

    constructor(client, event = null, cb) {
        this.client = client

        if (event) {
            this.recipient = event.recipient.id
            this.timestamp = event.timestamp
            this.payload = (event.postback) ? event.postback.payload : event.message.quick_reply.payload
            this.title = (event.postback) ? event.postback.title : event.message.text
            
            if(!event.sender) {
                this.client.wc = true
                event.sender = {
                    id: event.recipient.id
                }
            } else {
                this.client.wc = false
            }

            let user = new User(this.client, event.sender.id, () => cb(this))
            this.sender = user

            if(this.client.wc)
                cb(this)
        }
    }
}

module.exports = Postback