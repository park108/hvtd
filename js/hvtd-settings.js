// Save settings
function saveSettings() {

	log("Call...");

	// Set send data
	let params = {
		user: USER.id
	};
	let body = {
		settings: SETTINGS
	};
	let additionalParams = {};

	// Call Generated API Gateway SDK
	API.settings.settingsUserPost(params, body, additionalParams)
	.then(function(response) {
		setBottomMessage("success", getMessage("015"));
	}, function(error) {
		setBottomMessage("error", getMessage("016"));
	});
}

// Load settings
function loadSettings() {

	log("Call...");

	// Set send data
	let params = {
		user: USER.id
	};
	let body = {};
	let additionalParams = {};

	// Call Generated API Gateway SDK
	API.settings.settingsUserGet(params, body, additionalParams)
	.then(function(response) {

		let settings = response.data.settings;

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
			log(USER.id + " signed in by " + USER.id_provider);
		}

	}, function(error) {

		log(JSON.stringify(error));
		
	}).then(function() {

		// Set objects after load settings
		createUserInfo();
		setSelectedDateText();
		createCalendar(GLOBAL_VARIABLE.selected_date);
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

		log(JSON.stringify(error));
	});
}