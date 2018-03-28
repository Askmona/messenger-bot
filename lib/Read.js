const User = require("./User")

class Read {

    constructor(client, event = null, cb) {
        this.client = client
        if (event) {
            this.recipient = event.recipient.id
            this.timestamp = event.timestamp
            this.watermark = event.read.watermark
            this.sender = new User(this.client, event.sender.id, () => cb(this))
        }
    }
}

module.exports = Read