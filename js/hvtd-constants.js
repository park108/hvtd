// Load texts
function loadTexts() {

	log("Call...");

	return new Promise(function(resolve, reject) {

		// Set send data
		let params = {
			key: "TEXTS"
		};
		let body = {};
		let additionalParams = {};

		// Call Generated API Gateway SDK
		API.constants.keyGet(params, body, additionalParams)
		.then(function(response) {

			if(response.data.hasData) {
				TEXTS = response.data.data;
				resolve(response);
			}
			else {
				reject(new Error("No application global settings!"));
			}

		}, function(error) {
			
			reject(new Error("DB error!"));
			
		}).catch(function(error) {

			reject(new Error("error!"));
		});
	});
}