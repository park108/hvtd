// Save settings
function saveSettings() {

	log("Call...");

	// Set settings data
	let settings = {
		"settings": SETTINGS
	};

	// Convert data to JSON string
	let dataString = JSON.stringify(settings);

	// Call API
	let apiUrl = getApiUrl(API.SETTINGS, USER.id);

	callAPI(apiUrl, "POST", dataString).then(function(response) {

		log(response);

	}, function(error) {

		log(error);

	});
}

// Load settings
function loadSettings() {

	log("Call...");

	// Call API
	let apiUrl = getApiUrl(API.SETTINGS, USER.id);

	callAPI(apiUrl, "GET").then(function(response) {

		log(response);

		let data = JSON.parse(response);
		let settings = data.settings;

		// If has no data, set default value
		if(undefined == settings || null == settings || "" == settings) {

			SETTINGS.log = false;
			SETTINGS.language = "EN";
			SETTINGS.auto_collapse = true;
			SETTINGS.show_calendar = true;
			SETTINGS.auto_save_interval = 0;
			SETTINGS.show_toolbar = true;
			SETTINGS.tooltip = true;
		}

		// If has data, set data into settings value
		else {

			SETTINGS = settings;
		}

	}, function(error) {

		log(error);
		
	}).then(function() {

		// Set objects after load settings
		createUserInfo();
		setSelectedDateText();
		setCalendarVisibility(SETTINGS.show_calendar);
		setTooltipText();
		setAutoSaveInterval(SETTINGS.auto_save_interval);
		setToolbarButtonLayout();

		// In mobile, show shortcuts button
		if(!isMobile()) {
			showShortcutButton();
		}
		
		loadTodo();

	}).catch(function(error) {

		log(error);
	});
}