class User {

	constructor(client, id, socket_id) {
		this.client = client
		this.data = {
			id: id,
			socket_id : socket_id ? socket_id : null
		}
		this.wc = this.client.wc
		return this
	}

	get data() {
		return {
			id: this.id,
			socket_id: this.socket_id,
			first_name: this.first_name,
			last_name: this.last_name,
			profile_pic: this.profile_pic,
			locale: this.locale,
			timezone: this.timezone,
			gender: this.gender
		}
	}

	set data(value) {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				this[key] = value[key]
			}
		}
	}

	fullname() {
		return this.first_name + ' ' + this.last_name
	}

	seen() {
    this.client.seen(this.id)
	}
	
	// Sends the typing action
	typing(toggle = true) {
		return this.client.typing(this.id, toggle)
	}

    // Sends message to recipient
	send(value, style, persona, options = null) {
		return this.client.send(this, value, options, persona, style)
	}
	
	// Sends an image to recipient
  sendImage(url) {
		return this.client.sendImage(this.id, url)
  }

    // Sends an audio to recipient
  sendAudio(url) {
		return this.client.sendAudio(this.id, url)
  }

    // Sends an video to recipient
  sendVideo(url) {
		return this.client.sendVideo(this.id, url)
  }

    // Sends an file to recipient
  sendFile(url) {
		return this.client.sendFile(this.id, url)
  }
}

module.exports = User