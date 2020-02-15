const mongoose = require("mongoose");
const config = require("config");
const InvoiceSchema = new mongoose.Schema({
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
		required: true
	},
	billNumber: {
		type: String,
		required: true
	},
	billAmount: {
		type: String,
		required: true
	},
	billSubject: {
		type: String,
		required: true
	},
	billDate: {
		type: Date,
		required: true,
		default: Date.now
	},
	billDoc: {
		type: String,
		required: true
	},
	billRemark: {
		type: String
	},
	invoiceStatus: {
		type: Number,
		default: config.get("uploaded")
	},
	adminRemark: {
		type: String,
		default: null
	},
	rejectReason: {
		type: String,
		default: null
	}
});

module.exports = Invoices = mongoose.model("invoice", InvoiceSchema);
