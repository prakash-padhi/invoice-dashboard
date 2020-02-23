const mongoose = require("mongoose");
const config = require("config");
// For Mongo Atlas Database
//const db = config.get("mongoURI");
// For Mongo Local Database
const db = config.get("mongoLocalURI");
const connectDB = async () => {
	try {
		await mongoose
			.connect(db, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			})
			.then(response => {
				console.log("DATABASE CONNECTED");
			});
	} catch (err) {
		console.log(err.message);
		//Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
