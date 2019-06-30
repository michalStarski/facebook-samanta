const zditm_scrapper = require("../scripts/zditm_scrapper");
const actions = require("../definitions/actions");

const scrapperInvokers = (Samanta, formattedText, senderId) => ({
	ZDITM: {
		condition: actions.ZDITM.indexOf(formattedText.substring(0, 5)) >= 0,
		handler: () => {
			zditm_scrapper(formattedText.substring(5), Samanta, senderId);
		},
	},
});

module.exports = scrapperInvokers;
