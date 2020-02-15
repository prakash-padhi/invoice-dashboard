const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Profile = require("../../../models/teamUser");

// @route    GET api/allUsers
// @desc     Get all profiles
// @access   Public
router.get("/", auth, async (req, res) => {
	try {
		const members = await Profile.find().populate("member", [
			"name",
			"email",
			"mobile",
			"avatar",
			"status"
		]);
		res.json(members);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get("/user/:user_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			slackUserID: req.params.user_id
		}).populate("user", [
			"name",
			"email",
			"mobile",
			"avatar",
			"totalMoneyReceived",
			"status"
		]);
		if (!profile) return res.status(400).json({ msg: "Profile not found" });
		res.json(profile);
	} catch (err) {
		console.log(err.message);
		if (err.kind == "ObjectId") {
			return res.status(400).json({ msg: "Profile not found" });
		}
		res.status(500).send("Server Error");
	}
});

module.exports = router;