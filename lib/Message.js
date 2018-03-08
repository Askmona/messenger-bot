const User = require("./User")

class Message {

    constructor(client, event, cb) {
        this.client = client
        if (event) {
            this._mid = event.message.mid
            this._recipient = event.recipient.id
            this._timestamp = event.timestamp
            if (event.message.text) {
                this._type = "text"
                this._text = event.message.text
            } else if (event.message.sticker_id) {
                this._type = "sticker"
                this._sticker_id = event.message.sticker_id
                this.attachments = event.message.attachments
            } else if (event.message.attachments) {
                this._type = "attachments"
                this.attachments = event.message.attachments
            } else {
                return
            }
            this.sender = new User(this.client, event.sender.id, () => {
                cb(this)
            })
        }
    }

    get mid() {
        return this._mid
    }

    set mid(value) {
        this._mid = value
    }

    get recipient() {
        return this._recipient
    }

    set recipient(value) {
        this._recipient = value
    }

    get type() {
        return this._type
    }

    set type(value) {
        this._type = value
    }

    get text() {
        return this._text
    }

    set text(value) {
        this._text = value
    }

    get attachment() {
        return this._attachment
    }

    set attachment(value) {
        this._attachment = value
    }
    
    get timestamp() {
        return this._timestamp
    }

    set timestamp(value) {
        this._timestamp = value
    }
}

module.exports = Message