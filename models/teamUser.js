const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
	slackUserID: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	mobile: {
		type: String,
		required: true
	},
	status: {
		type: Boolean,
		default: true
	},
	avatar: {
		type: String,
		default:
			"https://gravatar.com/avatar/4895546766d8c0ef920688d211d52aef?s=200&d=robohash&r=x"
	},
	totalMoneyReceived: {
		type: String,
		default: "0"
	}
});

module.exports = Members = mongoose.model("member", MemberSchema);
