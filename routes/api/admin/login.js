const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// @route GET api/login
// @access Private
router.get("/", auth, async (req, res) => {
	try {
		const user = await Admin.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// @route POST api/login
// @desc Authenticate user & get token
// @access Public
router.post(
	"/",
	[
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Password is required").exists()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			// Check if user exists
			let user = await Admin.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid credentials" }] });
			}
			// Match the password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid credentials" }] });
			}

			// Return jsonwebtoken
			const payload = {
				user: {
					id: user.id
				}
			};
			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server error");
		}
	}
);

// @route    PUT api/login/profileUpdate
// @desc     Accept Invoice
// @access   Private
router.put(
	"/profileUpdate",
	auth,
	[
		check("name", "Name is required")
			.not()
			.isEmpty(),
		check("email", "Please enter a valid email").isEmail(),
		check("mobile", "Please enter a valid 10 digit mobile number").isLength({
			min: 10,
			max: 10
		})
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			var query = { _id: req.body.id };
			var newvalues = {
				$set: {
					name: req.body.name,
					email: req.body.email,
					mobile: req.body.mobile
				}
			};
			Admin.updateOne(query, newvalues, function (err, res) {
				if (err) console.log(err);
			});
			res.json({ successMsg: "Profile updated" });
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

module.exports = router;