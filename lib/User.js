class User {

	constructor(client, id, cb) {
		this.client = client
		this.client.get(id)
		.then(data => {
			this.data = JSON.parse(data)
			cb(this)
		})
		.catch(err => {
			console.log(new Error(err.error))
		})
	}

	get data() {
		return {
			id: this.id,
			first_name: this.first_name,
			last_name: this.last_name,
			profile_pic: this.profile_pic,
			locale: this.locale,
			timezone: this.timezone,
			gender: this.gender,
			created_at: this.created_at,
			updated_at: this.updated_at
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

	markSeen() {
        this.client.seen(this.id)
    }

	send(value, options = null) {
		let message = Object.assign((options && typeof options === "object") ? options : {},
						(typeof value === "string" || typeof value === "number") ? { text: value } : value)
		return this.client.post("me/messages", { recipient: { id: this.id }, message })
	}

	// Sends the typing action
    typing(toggle = true) {
        return this.client.post("me/messages", { recipient: { id: this.id }, sender_action: (toggle) ? "typing_on" : "typing_off" })
    }
}

module.exports = User