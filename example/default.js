const Client = require("@ask-mona/messenger-bot")
const bot = new Client({
    appSecret: "",
    verifyToken: "",
    accessToken: ""
})

// Postback are either a Postback Button or a Quick Reply with a payload
bot.on("postback", postback => {
	console.log(`Payload ${postback.payload} has been triggered`)
	postback.sender.send("You clicked on", postback.title)
})

bot.on("message", message => {
    console.log(message.sender.fullname(), "sent a message")

    if (message.type === "text") {
        message.sender.send("You said:", message.text)
    } else {
        message.sender.send("You didn't send a text! :(")
    }
})

bot.start(5000, client => {
    console.log("bot started on port", client.app.get('port'))
})