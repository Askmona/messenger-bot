const AWSXRay = require("aws-xray-sdk");

AWSXRay.captureHTTPsGlobal(require("http"));
AWSXRay.captureHTTPsGlobal(require("https"));

const got = require('got'),
  EventEmitter = require("events").EventEmitter,
  express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  Message = require("./Message"),
  Postback = require("./Postback"),
  Read = require("./Read"),
  Delivery = require("./Delivery"),
  crypto = require("crypto");

class Client extends EventEmitter {
  constructor(data) {
    super();

    this.appSecret = data.appSecret;
    this.verifyToken = data.verifyToken;
    this.accessToken = data.accessToken;
    this.graphVersion = "v5.0";
    this.debug = data.debug || false;
    this.app = express();
    this.express = express;
    this.app.use(cors());
    this.app.use(
      bodyParser.json({
        verify: this._verifyRequestSignature.bind(this),
        limit: "50mb",
        extended: true,
      })
    );
    this.app.use(
      bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 52428800,
      })
    );
    this.app.use(express.static("public"));
  }

  // Starts the express app
  start(port, cb) {
    this.http = require("http").Server(this.app);
    this.io = require("socket.io")(this.http);
    let redisAdapter = require("socket.io-redis");
    try {
      let adapter = redisAdapter({ host: "redis", port: 6379 });
      adapter.prototype.on("error", (err) => console.log("Redis timedout"));
      adapter.pubClient.on("error", function () {});
      adapter.subClient.on("error", function () {});
      this.io.adapter(adapter);
    } catch (e) {
      console.log("Can't connect to Redis");
    }
    this._routing();
    this.app.set("port", port.http || 5000);
    this.socketPort = port.socket;

    this.server = this.app.listen(this.app.get("port"), () => {
      cb(this);
    });

    this.socket = this.http.listen(3000, () => {
      cb(this);
    });
  }

  // Post from endpoint
  post(endpoint, json, retry = 0) {
    return got.post(
      `https://graph.facebook.com/${this.graphVersion}/${endpoint}?access_token=${this.accessToken}`,
      { responseType: 'json', json }
    )
      .then(() => {
        if (this.debug) {
          console.log(`Successfully post on endpoint: ${endpoint}`);
        }
      })
      .catch((err) => {
        if (!err.response) {
          console.error("[POST] Request error :\n", err.message)
          return
        }

        const fbError = err.response.body.error;
        console.error("[POST] Facebook error :\n", fbError)

        if (fbError.error_subcode === 99 && retry < 5) {
          retry++
          return this.post(endpoint, json, retry);
        }
      });
  }

  // Get from endpoint
  get(endpoint) {
    return got.get(
      `https://graph.facebook.com/${this.graphVersion}/${endpoint}?access_token=${this.accessToken}`,
      { responseType: 'json' }
    )
      .then((res) => res.body)
      .catch((err) => {
        if (!err.response) {
          console.error("[GET] Request error :\n", err.message)
          return
        }

        const fbError = err.response.body.error;
        console.error("[GET] Facebook error :\n", fbError)
      });
  }

  // Sends the typing action
  typing(id, toggle = true) {
    return this.post("me/messages", {
      recipient: { id: id.split("_")[1] },
      sender_action: toggle ? "typing_on" : "typing_off",
    });
  }

  // Sends the mark_as_seen action
  seen(id) {
    return this.post("me/messages", {
      recipient: { id: id.split("_")[1] },
      sender_action: "mark_seen",
    });
  }

  // Sends message to recipient
  send(sender, value, options = null, persona, style) {
    if (value) {
      let message =
        typeof value === "string" || typeof value === "number"
          ? { text: value }
          : value;

      let data = { recipient: { id: sender.id.split("_")[1] }, message };

      if (persona) data.persona_id = persona;

      if (options && sender.wc) data = Object.assign(data, options);

      if (sender.wc)
        return this.io.to(sender.data.socket_id).emit("message", data);
      else return this.post("me/messages", data);
    }
  }

  // Sends attachment to recipient
  sendAttachment(recipient, type, url) {
    return this.send(recipient, {
      attachment: {
        type,
        payload: {
          url,
        },
      },
    });
  }

  // Sends an image to recipient
  sendImage(recipient, url) {
    return this.sendAttachment(recipient, "image", url);
  }

  // Sends an audio to recipient
  sendAudio(recipient, url) {
    return this.sendAttachment(recipient, "audio", url);
  }

  // Sends an video to recipient
  sendVideo(recipient, url) {
    return this.sendAttachment(recipient, "video", url);
  }

  // Sends an file to recipient
  sendFile(recipient, url) {
    return this.sendAttachment(recipient, "file", url);
  }

  // Routing
  _routing() {
    if (this.verifyToken) {
      this.app.get("/webhook", (req, res) => {
        if (
          req.query["hub.mode"] === "subscribe" &&
          req.query["hub.verify_token"] === this.verifyToken
        ) {
          console.log("Validating webhook");
          res.status(200).send(req.query["hub.challenge"]);
        } else {
          console.error(
            "Failed validation. Make sure the validation tokens match."
          );
          res.sendStatus(403);
        }
      });
    }

    this.app.post("/webhook", (req, res) => {
      if (req.body.object === "page") {
        this._handlePost(req.body);
        res.sendStatus(200);
      }
    });

    this.io.on("connection", (socket) => {
      socket.on("message", (data) => {
        this.socket = socket;
        try {
          data = JSON.parse(data);
          data.socket_id = socket.id;
          var msg = {
            entry: [
              {
                messaging: [data],
              },
            ],
          };
        } catch (e) {
          socket.emit("error", { error: "Data format" });
          return;
        }

        this._handlePost(msg);
      });
    });
  }

  _handlePost(data) {
    if (data.entry) {
      data.entry.forEach((entry) => {
        if (entry.messaging) {
          entry.messaging.forEach((event) => {
            if (
              event.message &&
              !event.message.quick_reply &&
              !event.message.is_echo
            ) {
              new Message(this, event, (message) => {
                this.emit("message", message);
              });
            } else if (
              event.postback ||
              event.referral ||
              (event.message &&
                event.message.quick_reply &&
                !event.message.is_echo)
            ) {
              new Postback(this, event, (postback) => {
                this.emit("postback", postback);
              });
            } else if (event.read) {
              new Read(this, event, (read) => {
                this.emit("read", read);
              });
            } else if (event.delivery) {
              new Delivery(this, event, (delivery) => {
                this.emit("delivery", delivery);
              });
            }
          });
        }
      });
    }
  }

  // Verify Signature
  _verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
      console.error("Couldn't validate the signature.");
    } else {
      var elements = signature.split("=");
      var method = elements[0];
      var signatureHash = elements[1];

      var expectedHash = crypto
        .createHmac("sha1", this.appSecret)
        .update(buf)
        .digest("hex");

      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }
}

module.exports = Client;
