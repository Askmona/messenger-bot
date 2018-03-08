const User = require("./User")

class Postback {

    constructor(client, event = null, cb) {
        this.client = client
        if (event) {
            this._recipient = event.recipient.id
            this._timestamp = event.timestamp
            this._payload = (event.postback) ? event.postback.payload : event.message.quick_reply.payload
            this._title = (event.postback) ? event.postback.title : event.message.text
            this.sender = new User(this.client, event.sender.id, () => {
                cb(this)
            })
        }
    }

    get recipient() {
        return this._recipient
    }

    set recipient(value) {
        this._recipient = value
    }

    get payload() {
        return this._payload
    }

    set payload(value) {
        this._payload = value
    }

    get title() {
        return this._title
    }

    set title(value) {
        this._title = value
    }

    get timestamp() {
        return this._timestamp
    }

    set timestamp(value) {
        this._timestamp = value
    }
}

module.exports = Postback