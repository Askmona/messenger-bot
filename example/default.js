const Client = require("../lib/Client")
const bot = new Client({
    appSecret: "29f08fbf290fde25e70ed253863508b9",
    verifyToken: "thomasleplusbeau",
    accessToken: "EAAW29nBNgkMBAFmjJUTPL0gKHJnoBqCbAEIz6ERFdiBsBdiHabPhsjQVGgCXrdEzJ9m53eCldeZBEtA2aHFDzcZCpqYKwFvgqz84qNUw4B7O1CGVrvFOkOYUlSUa5GsAEjFgVZCiPtCrQ1N7sFj9yGCQZB2Mc68j1ZAFp2vBCogZDZD"
})

// Postback are either a Postback Button or a Quick Reply with a payload
bot.on("postback", postback => {
	console.log(`Payload ${postback.payload} has been triggered`)
	postback.sender.send("You clicked on", postback.title)
})

bot.on("message", message => {
    if(message.sender.wc) {
        message.sender.send('lol')
        return
    } else {
        console.log(message.sender.fullname(), "sent a message")
    }

    if (message.type === "text") {
        message.sender.send(`You said: ${message.text}`)
    } else {
        message.sender.send("You didn't send a text! :(")
    }
})

bot.start({http:5002, socket:3001}, client => {
    console.log("bot started on port", client.app.get('port'))
    console.log("And also on socket port", client.socketPort)
})