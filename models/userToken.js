const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
	slackUserID: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	webhookURL: {
		type: String,
		required: true
	}
});

module.exports = Token = mongoose.model("token", TokenSchema);
