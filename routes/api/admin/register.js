const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const auth = require("../../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../../models/adminUser");

// @route POST api/register
// @desc Register user
router.post(
	"/",
	auth,
	[
		check("name", "Name is required")
			.not()
			.isEmpty(),
		check("email", "Please enter a valid email").isEmail(),
		check("mobile", "Please enter a valid 10 digit mobile number").isLength({
			min: 10,
			max: 10
		}),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, mobile, password } = req.body;
		try {
			// See if user exists
			let user = await User.findOne({ email });
			let userMobile = await User.findOne({ mobile });
			if (user || userMobile) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User already exists" }] });
			}

			// Get users gravatar
			const avatar = gravatar.url(email, {
				s: "200",
				r: "pg",
				d: "wavatar"
			});
			user = new User({
				name,
				email,
				mobile,
				avatar,
				password
			});

			// Encrypt password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			// SEND RESPONSE
			res.status(200).json({ successMsg: "Admin added successfully." });
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
