const express = require("express");
const router = express.Router();
const tokenData = require("../../../models/userToken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/slackAuth");

// @route GET api/invoices
router.get("/get/:slackUserID", auth, async (req, res) => {
	try {
		const data = await tokenData
			.findOne({
				slackUserID: req.params.slackUserID
			})
			.populate("user", [
				"token",
				"webhookURL"
			]);
		res.json(data);
	} catch (error) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route POST api/saveToken
// @desc Save user token
router.post(
	"/save",
	auth,
	[
		check("slackUserID", "Slack User ID is required")
			.not()
			.isEmpty(),
		check("token", "Token is required")
			.not()
			.isEmpty(),
		check("webhookURL", "Webhook URL is required")
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { slackUserID, token, webhookURL } = req.body;
		try {
			let user = await tokenData.findOne({ slackUserID });
			if (user) {
				var query = { slackUserID: slackUserID };
				var newvalues = {
					$set: { token: token, webhookURL: webhookURL }
				};
				tokenData.updateOne(query, newvalues, function (err, res) {
					if (err) console.log(err);
				});
			} else {
				userToken = new tokenData({
					slackUserID,
					token,
					webhookURL
				});
				// Encrypt token
				// const salt = await bcrypt.genSalt(10);
				// userToken.token = await bcrypt.hash(token, salt);
				await userToken.save();
			}
			// SEND RESPONSE
			res.status(200).json({ successMsg: "Token and webhook URL saved successfully." });
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;