const User = require("./User")

class Postback {

    constructor(client, event = null, cb) {
        this.client = client

        if (event) {
            this.recipient = event.recipient.id
            this.timestamp = event.timestamp
            if ((!event.postback  && !event.message) || (event.postback && event.postback.referral)) {
                if(event.referral) {
                    this.payload = null
                    this.referral = event.referral
                }
                else {
                    this.title = (event.postback) ? event.postback.title : event.message.text
                    this.payload = (event.postback) ? event.postback.payload : event.message.quick_reply.payload
                    this.referral = event.postback.referral
                }
            } else {
                this.title = (event.postback) ? event.postback.title : event.message.text
                this.payload = (event.postback) ? event.postback.payload : event.message.quick_reply.payload
            }

            if(event.postback && event.postback.referral && event.postback.referral.source == "CUSTOMER_CHAT_PLUGIN")
                this.ccp = true
            else if(event.message && event.message.tags && event.message.tags.source == "customer_chat_plugin")
                this.ccp = true

            if(event.postback && event.postback.start)
                this.start = true

            if(!event.sender) {
                this.client.wc = true
                this.ccp = true
                event.sender = {
                    id: event.recipient.id
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

module.exports = Postback