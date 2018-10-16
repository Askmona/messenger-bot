const User = require("./User")

class Read {

    constructor(client, event = null, cb) {
        this.client = client
        if (event) {
            this.recipient = event.recipient.id
            this.timestamp = event.timestamp
            this.watermark = event.read.watermark
            
            if(!event.sender) {
                this.client.wc = true
                event.sender = {
                    id: event.recipient.id
                }
            }

            let user = new User(this.client, event.sender.id, () => cb(this))
            this.sender = user

            if(this.client.wc)
                cb(this)        
        }
    }
}

module.exports = Read