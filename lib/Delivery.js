const User = require("./User")

class Delivery {

    constructor(client, event = null, cb) {
        this.client = client
        if (event) {
            this.recipient = event.recipient.id
            this.timestamp = event.timestamp
            this.mids = event.delivery.mids
            this.watermark = event.delivery.watermark

            if(!event.sender)
                this.sender = new User(this.client, event.recipient.id, () => cb(this), true)
            else
                this.sender = new User(this.client, event.sender.id, () => cb(this))
        }
    }
}

module.exports = Delivery