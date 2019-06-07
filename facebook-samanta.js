#!/usr/bin/node
const express = require("express");
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const router = express.Router();

const facebook = require("./webhooks/facebook")(router);
const github = require("./webhooks/github")(router);
const sendWeather = require("./scripts/sendWeather");
const Samanta = require("./Samanta/Samanta");
const credentials = require("./utils/get-credentials");

//Create Samanta Object that will response to user requests
const Sam = new Samanta(credentials["page-access-token"]);

//Middleware
app.use(bodyParser.json());

//Webhooks
app.use("/facebook", facebook);
app.use("/github", github);

// Creates the endpoint for our webhook
app.post("/facebook/webhook", (req, res) => {
	console.log("Im here at the post");
	let body = req.body;
	console.log(body);

	// Checks this is an event from a page subscription
	if (body.object === "page") {
		// Iterates over each entry - there may be multiple if batched
		body.entry.forEach(function(entry) {
			// Gets the message. entry.messaging is an array, but
			// will only ever contain one message, so we get index 0
			let webhook_event = entry.messaging[0];
			let senderId = webhook_event.sender.id;
			let text = webhook_event.message.text;
			let attachments = webhook_event.message.attachments;
			console.log(webhook_event);

			if (text) {
				console.log(webhook_event);
				console.log(text);

				Sam.sendFacebookMessage(text, senderId);
			} else if (attachments[0].payload.url) {
				Sam.sendSticker(senderId);
			} else if (attachments[0].type === "location") {
				console.log(attachments[0].payload.coordinates);
				const lat = attachments[0].payload.coordinates.lat;
				const long = attachments[0].payload.coordinates.long;
				sendWeather(senderId, lat, long, Sam);
			} else {
				Sam.messageUnknown(senderId);
			}
		});
		// Returns a '200 OK' response to all requests
		res.status(200).send("EVENT_RECEIVED");
	} else {
		// Returns a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404);
	}
});

// Get will trigger Samanta's docs
app.get("/", (req, res) => {
	res.send("Samanta - a facebook messenger bot");
});

http.listen(
	process.env.PORT || 8080,
	console.log(`Samanta running on port ${process.env.PORT || 8080}`)
);
