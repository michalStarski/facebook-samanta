const axios = require("axios");
const qs = require("qs");

async function ztm_quick_look(stop, line) {
	const { data } = await axios
		.get(
			`https://hanabi.sealcode.org/poznan-mpk-api/api/quick_look?${qs.stringify(
				{
					stop,
					line,
				}
			)}`
		)
		.catch(e => console.error(e));

	let message = `Linia: ${data.line}\n`;
	for (const arrival of data) {
		message += `*Kierunek:${arrival.final_destination}*\n ${arrival.hour}:${
			arrival.minutes
		} ${
			arrival.is_today ? "" : `(${arrival.day})`
		}\n====================\n`;
	}
	return message;
}

async function ztm_get_routes(from, to) {
	const { data } = await axios
		.get(
			`https://hanabi.sealcode.org/poznan-mpk-api/api/get_routes?${qs.stringify(
				{
					from,
					to,
				}
			)}`
		)
		.catch(e => console.error(e));
	console.log(data);
}

module.exports = { ztm_get_routes, ztm_quick_look };
