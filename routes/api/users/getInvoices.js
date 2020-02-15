const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const InvoiceData = require("../../../models/InvoicesModel");
const tokenData = require("../../../models/userToken");
const { check, validationResult } = require("express-validator");
const teamUserData = require("../../../models/teamUser");
const { IncomingWebhook } = require('@slack/webhook');

// @route GET api/invoices
router.get("/", auth, async (req, res) => {
	try {
		const invoices = await InvoiceData.find()
			.sort({ $natural: -1 })
			.populate("user", [
				"name",
				"email",
				"billAmount",
				"billSubject",
				"billDate",
				"billDoc",
				"billRemark"
			]);
		res.json(invoices);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server Error");
	}
});

// @route    PUT api/invoices/paid
// @desc     Accept Invoice
// @access   Private
router.put(
	"/paid",
	[
		auth,
		[
			check("id", "ID is required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			var query = { _id: req.body.id };
			var newvalues = {
				$set: { invoiceStatus: 6, adminRemark: "Invoice paid" }
			};
			InvoiceData.updateOne(query, newvalues, function (err, res) {
				if (err) console.log(err);
			});
			res.json({ successMsg: "Invoice paid!" });
			const invData = await InvoiceData
				.findOne({
					_id: req.body.id
				})
				.populate("user", [
					"slackUserID",
					"name",
					"billAmount",
					"billSubject",
					"billDate"
				]);
			const data = await tokenData
				.findOne({
					slackUserID: invData.slackUserID
				})
				.select('webhookURL');
			const webhook = new IncomingWebhook(data.webhookURL);
			// Send the notification
			await webhook.send({
				text: `Congrats! ${invData.name} :celebrate: Your invoice amounting to ₹${invData.billAmount} has been paid`,
			});
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// @route    PUT api/invoices/accept
// @desc     Accept Invoice
// @access   Private
router.put(
	"/accept",
	[
		auth,
		[
			check("id", "ID is required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			var query = { _id: req.body.id };
			var newvalues = {
				$set: { invoiceStatus: 3, adminRemark: "Invoice accepted" }
			};
			InvoiceData.updateOne(query, newvalues, function (err, res) {
				if (err) console.log(err);
			});
			res.json({ successMsg: "Invoice accepted!" });
			const invData = await InvoiceData
				.findOne({
					_id: req.body.id
				})
				.populate("user", [
					"slackUserID",
					"name",
					"billAmount",
					"billSubject",
					"billDate"
				]);
			const data = await tokenData
				.findOne({
					slackUserID: invData.slackUserID
				})
				.select('webhookURL');
			const webhook = new IncomingWebhook(data.webhookURL);
			// Send the notification
			await webhook.send({
				text: `Congratulations! ${invData.name} :celebrate: Your invoice amounting to ₹${invData.billAmount} has been approved`,
			});
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// @route    PUT api/invoices/reject
// @desc     Reject Invoice
// @access   Private
router.put(
	"/reject",
	[
		auth,
		[
			check("id", "ID is required")
				.not()
				.isEmpty(),
			check("rejectReason", "Reason for Reject is required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			var query = { _id: req.body.id };
			var reasonToReject = null;
			if (req.body.rejectReason !== "") {
				reasonToReject = req.body.rejectReason;
			} else {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid reason provided" }] });
			}
			var newvalues = {
				$set: {
					invoiceStatus: 4,
					adminRemark: "Invoice rejected",
					rejectReason: reasonToReject
				}
			};
			InvoiceData.updateOne(query, newvalues, function (err, res) {
				if (err) console.log(err);
			});
			res.json({ successMsg: "Invoice rejected!" });
			const invData = await InvoiceData
				.findOne({
					_id: req.body.id
				})
				.populate("user", [
					"slackUserID",
					"name",
					"billAmount",
					"billSubject",
					"billDate"
				]);
			console.log(invData);
			const data = await tokenData
				.findOne({
					slackUserID: invData.slackUserID
				})
				.select('webhookURL');
			const webhook = new IncomingWebhook(data.webhookURL);
			// Send the notification
			await webhook.send({
				text: `Sorry! ${invData.name} :celebrate: Your invoice amounting to ₹${invData.billAmount} has been rejected (Reason - ${req.body.rejectReason})`,
			});
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server Error");
		}
	}
);

module.exports = router;