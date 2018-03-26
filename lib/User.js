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
			id: this._id,
			first_name: this._first_name,
			last_name: this._last_name,
			profile_pic: this._profile_pic,
			locale: this._locale,
			timezone: this._timezone,
			gender: this._gender,
			created_at: this._created_at,
			updated_at: this._updated_at
		}
	}

	set data(value) {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				this[`_${key}`] = value[key]
			}
		}
	}

	fullname() {
		return this._first_name + ' ' + this._last_name
	}

	markSeen() {
        this.client.seen(this._id)
    }

	send(value, options = null) {
		let message = Object.assign((options && typeof options === "object") ? options : {},
						(typeof value === "string" || typeof value === "number") ? { text: value } : value)
		return this.client.post("me/messages", { recipient: { id: this._id }, message })
	}

	// Sends the typing action
    typing(toggle = true) {
        return this.client.post("me/messages", { recipient: { id: this._id }, sender_action: (toggle) ? "typing_on" : "typing_off" })
    }

	get id() {
		return this._id
	}

	set id(value) {
		this._id = value
	}


	get first_name() {
		return this._first_name
	}

	set first_name(value) {
		this._first_name = value
	}


	get last_name() {
		return this._last_name
	}

	set last_name(value) {
		this._last_name = value
	}

	get profile_pic() {
		return this._profile_pic
	}

	set profile_pic(value) {
		this._profile_pic = value
	}

	get locale() {
		return this._locale
	}

	set locale(value) {
		this._locale = value
	}

	get timezone() {
		return this._timezone
	}

	set timezone(value) {
		this._timezone = value
	}

	get gender() {
		return this._gender
	}

	set gender(value) {
		this._gender = value
	}

	get created_at() {
		return this._created_at
	}

	set created_at(value) {
		this._created_at = value
	}
}

module.exports = User