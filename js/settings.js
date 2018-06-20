// Call Settings API
let httpRequestSettings;
function callSettingsAPI(method, callback, data) {
	
	if(window.XMLHttpRequest) {
		httpRequestSettings = new XMLHttpRequest();
	}
	else if(window.ActiveXObject) { // Above IE 8
		httpRequestSettings = new ActiveXObject("Microsoft.XMLHTTP");
	}

	let apiUrl = "https://g72s9v6ioa.execute-api.ap-northeast-2.amazonaws.com" // API Gateway URL
		+ "/test" // API Stage name
		+ "/settings" // API Name
		+ "/" + USER.id // TODO: Param: User account

	httpRequestSettings.onreadystatechange = callback;
	httpRequestSettings.open(method, apiUrl, true);
	httpRequestSettings.setRequestHeader("Content-type", "application/json");

	if("GET" == method) {
		httpRequestSettings.send();
	}
	else {
		httpRequestSettings.send(data);	
	}

	log("CALL SETTINGS API: " + method + " " + apiUrl + " ... " + "DATA = {" + data + "}");
}

// Save settings into storage
function saveSettings() {

	// Set settings data
	let settings = {
		"log": SETTINGS.log,
		"language": SETTINGS.language,
		"auto_copy": SETTINGS.auto_copy,
		"auto_collapse": SETTINGS.auto_collapse
	};

	// Convert data to JSON string
	let dataString = JSON.stringify(settings);

	// Save settings
	callSettingsAPI("POST", callbackSaveSettings, dataString);

	log("SAVE_SETTINGS");
}

// Callback function after save settings
function callbackSaveSettings() {

	if (httpRequestSettings.readyState === 4) {

		if (httpRequestSettings.status === 200) {
			log("CALLBACK_SAVE_SETTINGS: OK.");
		}
		else {
			log("CALLBACK_SAVE_SETTINGS: Save failed.");
		}
	}
}

// Load settings
function loadSettings() {

	// Get settings
	callSettingsAPI("GET", callbackLoadSettings);

	log("LOAD_SETTINGS");
}

// Callback function after load Settings
function callbackLoadSettings() {

	if (httpRequestSettings.readyState === 4) {

		if (httpRequestSettings.status === 200) {

			let data = JSON.parse(httpRequestSettings.responseText);
			let settings = data.settings;

			// If has no data, set default value
			if(undefined == settings || null == settings || "" == settings) {

				SETTINGS.log = false;
				SETTINGS.language = "EN";
				SETTINGS.auto_copy = true;
				SETTINGS.false = true;

				log("CALLBACK_LOAD_SETTINGS: No Data -> Set default value");
			}

			// If has data, set data into settings value
			else {

				SETTINGS.log = settings.log;
				SETTINGS.language = settings.language;
				SETTINGS.auto_copy = settings.auto_copy;
				SETTINGS.auto_collapse = settings.auto_collapse;
				
				log("CALLBACK_LOAD_SETTINGS: OK = " + JSON.stringify(settings));
			}
		}
		else {
			log("CALLBACK_LOAD_SETTINGS: Load failed.");
		}

		createUserInfo();
		setSelectedDate();
		loadTodo();
	}
}