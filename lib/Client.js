const   request 			= require('request-promise-native'),
        EventEmitter 	    = require("events").EventEmitter,
        express             = require("express"),
        bodyParser          = require("body-parser"),
        Message             = require("./Message"),
        Postback            = require("./Postback"),
        crypto              = require("crypto")
        

class Client extends EventEmitter {

    constructor (data) {
        super()
        if (!data.appSecret || !data.verifyToken || !data.accessToken) {
            throw new Error("You need to specify appSecret, verifyToken and accessToken first!")
        }
        this.appSecret = data.appSecret
        this.verifyToken = data.verifyToken
        this.accessToken = data.accessToken
        this.graphVersion = "v2.12"
        this.debug = data.debug || false
        this.app = express()
        this.app.use(bodyParser.json({ verify: this._verifyRequestSignature.bind(this) }))
        this.app.use(express.static('public'))
    }

    // Starts the express app
    start(port, cb) {
        this._routing()
        this.app.set('port', port || 5000)
        this.server = this.app.listen(this.app.get('port'), () => {
            cb(this)
        })
    }

	// Post from endpoint
    post(endpoint, json) {
		return request({
			uri: `https://graph.facebook.com/${this.graphVersion}/${endpoint}?access_token=${this.accessToken}`,
			method: 'POST',
			json: json,
		}, (err, response, body) => {
            if (this.debug) {
                if (!err && response.statusCode == 200) {
                    console.log("Successfully sent message");
                } else {
                    console.log('ERROR '+ response.body.error.message)
                }
            }
        })
    }

    // Get from endpoint
    get(endpoint) {
        return request(`https://graph.facebook.com/${this.graphVersion}/${endpoint}?access_token=${this.accessToken}`)
    }
    
    // Sends the typing action
    typing(id, toggle) {
        return this.post("me/messages", { recipient: { id }, sender_action: (toggle) ? "typing_on" : "typing_off" })
    }
    
    // Sends the mark_as_seen action
    seen(id) {
        return this.post("me/messages", { recipient: { id }, sender_action: 'mark_seen' })
    }
    
    // Routing
    _routing() {
        this.app.get("/webhook", (req, res) => {
            if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === this.verifyToken) {
                console.log("Validating webhook");
                res.status(200).send(req.query['hub.challenge']);
            } else {
                console.error("Failed validation. Make sure the validation tokens match.");
                res.sendStatus(403);          
            }
        })

        this.app.post("/webhook", (req, res) => {
            if (req.body.object === 'page') {
                this._handlePost(req.body)                
                res.sendStatus(200)
            }
        })
    }

    _handlePost(data) {
        if (data.entry) {
            data.entry.forEach(entry => {
                if (entry.messaging) {
                    entry.messaging.forEach(event => {
                        if (event.message && !event.message.quick_reply) {
                            new Message(this, event, message => {
                                this.emit("message", message)
                            })
                        } else if (event.postback || (event.message && event.message.quick_reply)) {
                            new Postback(this, event, postback => {
                                this.emit("postback", postback)
                            })
                        }
                    })
                }
            })
        }
    }

    // Verify Signature
    _verifyRequestSignature(req, res, buf) {
		var signature = req.headers["x-hub-signature"]

		if (!signature) {
			console.error("Couldn't validate the signature.")
		} else {
			var elements = signature.split('=')
			var method = elements[0]
			var signatureHash = elements[1]

			var expectedHash = crypto.createHmac('sha1', this.appSecret).update(buf).digest('hex')

			if (signatureHash != expectedHash) {
				throw new Error("Couldn't validate the request signature.");
			}
		}
	}
}

module.exports = Client