const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/slackAuth");
const { check, validationResult } = require("express-validator");
const teamUserData = require("../../../models/teamUser");
const InvoiceData = require("../../../models/InvoicesModel");

// @route POST api/invoiceUpload
router.post(
	"/",
	[
		check("slackUserID", "Slack User ID is required")
			.not()
			.isEmpty(),
		check("name", "Name is required")
			.not()
			.isEmpty(),
		check("email", "Please enter a valid email").isEmail(),
		check("mobile", "Mobile is required")
			.not()
			.isEmpty(),
		check("billNumber", "Please provide valid bill number")
			.not()
			.isEmpty(),
		check("billAmount", "Please provide valid bill amount")
			.not()
			.isEmpty(),
		check("billSubject", "Please provide valid bill subject")
			.not()
			.isEmpty(),
		check("billDoc", "Please provide valid bill document")
			.not()
			.isEmpty()
	],
	auth,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			slackUserID,
			name,
			email,
			mobile,
			billNumber,
			billAmount,
			billSubject,
			billDate,
			billDoc,
			billRemark
		} = req.body;
		// Invoice Data
		billData = new InvoiceData({
			slackUserID,
			name,
			email,
			billNumber,
			billAmount,
			billSubject,
			billDate,
			billDoc,
			billRemark
		});
		// Save to Database
		await billData.save();
		let userExists = await teamUserData.findOne({ slackUserID });
		let emailExists = await teamUserData.findOne({ email });
		if (!userExists && !emailExists) {
			userData = new teamUserData({
				slackUserID,
				name,
				email,
				mobile
			});
			await userData.save();
		}
		// Success response
		res.status(200).send("Your invoice uploaded successfully!!");
	}
);

module.exports = router;