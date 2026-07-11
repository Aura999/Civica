const mongoose = require("mongoose");

exports.connect = async () => {
	const { MONGODB_URL } = process.env;

	if (!MONGODB_URL) {
		throw new Error("MONGODB_URL is not configured");
	}

	console.log("Connecting to MongoDB...");

	await mongoose.connect(MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	console.log("MongoDB connection established");
};
