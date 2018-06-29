function openSettings() {

	// Close user dropdown menu
	toggleUserDropdown();

	// Open settings
	let settings = E("settings");
	settings.style.display = "block";

	// Get settings list
	let settingsList = E("settings-list");

	// Create settings item
	let select, option, checkbox, span, label, item, div;

	// 1. Language
	select = document.createElement("select");
	select.setAttribute("id", "settings-language");
	select.setAttribute("onchange", "setLanguage(this)");

	option = document.createElement("option");
	option.setAttribute("id", "settings-language-ko");
	option.setAttribute("value", "KO");
	option.innerHTML = getKeyword("LANGUAGE_KO");
	if("KO" == SETTINGS.language) {
		option.setAttribute("selected", "true");
	}
	select.appendChild(option);

	option = document.createElement("option");
	option.setAttribute("id", "settings-language-en");
	option.setAttribute("value", "EN");
	option.innerHTML = getKeyword("LANGUAGE_EN");
	if("EN" == SETTINGS.language) {
		option.setAttribute("selected", "true");
	}
	select.appendChild(option);

	item = getSettingsItem("settings-language-label", select);
	settingsList.appendChild(item);

	// 2. Auto collapse
	checkbox = document.createElement("input");
	checkbox.classList.add("settings-checkbox-slider");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("onclick", "setAutoCollapse(this)");
	if(SETTINGS.auto_collapse) {
		checkbox.checked = true;
	}
	else {
		checkbox.checked = false;
	}

	span = document.createElement("span");
	span.classList.add("slider");

	label = document.createElement("label");
	label.classList.add("switch");
	label.appendChild(checkbox);
	label.appendChild(span);

	item = getSettingsItem("settings-autocollapse-label", label);
	settingsList.appendChild(item);

	// 3. Show calendar
	checkbox = document.createElement("input");
	checkbox.classList.add("settings-checkbox-slider");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("onclick", "setShowCalendar(this)");
	if(SETTINGS.show_calendar) {
		checkbox.checked = true;
	}
	else {
		checkbox.checked = false;
	}

	span = document.createElement("span");
	span.classList.add("slider");

	label = document.createElement("label");
	label.classList.add("switch");
	label.appendChild(checkbox);
	label.appendChild(span);

	item = getSettingsItem("settings-showcalendar-label", label);
	settingsList.appendChild(item);

	// 4. Auto save
	div = document.createElement("div");

	input = document.createElement("input");
	input.setAttribute("id", "settings-autosave-interval");
	input.setAttribute("type", "number");
	input.setAttribute("min", "0");
	input.setAttribute("max", "60");
	input.setAttribute("placeholder", "0 - 60");
	input.setAttribute("onchange", "setAutoSave(this)");
	input.value = SETTINGS.auto_save_interval;
	if(0 == input.value) {
		input.classList.add("input-deactivate");
	}
	div.appendChild(input);

	label = document.createElement("span");
	label.setAttribute("id", "settings-autosave-unit");
	label.style.width = "20%";
	div.appendChild(label);

	item = getSettingsItem("settings-autosave-label", div);
	settingsList.appendChild(item);

	// 5. Tooltip
	checkbox = document.createElement("input");
	checkbox.classList.add("settings-checkbox-slider");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("onclick", "setShowTooltip(this)");
	if(SETTINGS.tooltip) {
		checkbox.checked = true;
	}
	else {
		checkbox.checked = false;
	}

	span = document.createElement("span");
	span.classList.add("slider");

	label = document.createElement("label");
	label.classList.add("switch");
	label.appendChild(checkbox);
	label.appendChild(span);

	item = getSettingsItem("settings-tooltip-label", label);
	settingsList.appendChild(item);

	// Set components text
	setText();
}

function getSettingsItem(id, value) {

	let itemTitle = document.createElement("div");
	itemTitle.setAttribute("id", id);
	itemTitle.classList.add("settings-item-title");

	let itemValue = document.createElement("div");
	itemValue.setAttribute("class", "settings-item-value");
	if(undefined != value && null != value && "" != value) {
		itemValue.appendChild(value);
	}

	let item = document.createElement("div");
	item.classList.add("settings-item");
	item.appendChild(itemTitle);
	item.appendChild(itemValue);

	return item;
}

function setText() {

	// setInnerHtml(DOM_ID, text);
	setInnerHtml("settings-title", getKeyword("USER_DROPDOWN_SETTINGS"));
	setInnerHtml("settings-language-label", getKeyword("SETTINGS_LANGUAGE"));
	setInnerHtml("settings-language-ko", getKeyword("LANGUAGE_KO"));
	setInnerHtml("settings-language-en", getKeyword("LANGUAGE_EN"));
	setInnerHtml("settings-autocollapse-label", getKeyword("SETTINGS_COLLAPSE"));
	setInnerHtml("settings-showcalendar-label", getKeyword("SETTINGS_SHOWCALENDAR"));
	setInnerHtml("settings-autosave-label", getKeyword("SETTINGS_AUTOSAVE"));
	setInnerHtml("settings-autosave-unit", getKeyword("SETTINGS_AUTOSAVE_UNIT"));
	setInnerHtml("settings-tooltip-label", getKeyword("SETTINGS_TOOLTIP"));
	setInnerHtml("settings-close-button", getKeyword("OK"));
}

function closeSettings() {

	// Remove settings items
	let settingsList = E("settings-list");
	settingsList.innerHTML = "";

	let settings = E("settings");
	settings.style.display = "none";
}

function setLanguage(selectedLanguage) {

	if(undefined != selectedLanguage) {

		let language = selectedLanguage.options[selectedLanguage.selectedIndex].value;
		SETTINGS.language = language;

		log(SETTINGS.language);

		saveSettings();

		// Change text
		setSelectedDateText();
		setText();
		setTooltipText();
	}
}

function setAutoCollapse(checkbox) {

	if(undefined == checkbox || null == checkbox) {
		SETTINGS.auto_collapse = !SETTINGS.auto_collapse;
	}
	else {
		SETTINGS.auto_collapse = checkbox.checked;
	}

	log(SETTINGS.auto_collapse);

	saveSettings();
}

function setShowCalendar(checkbox) {

	if(undefined == checkbox || null == checkbox) {
		SETTINGS.show_calendar = !SETTINGS.show_calendar;
	}
	else {
		SETTINGS.show_calendar = checkbox.checked;
	}

	log(SETTINGS.show_calendar);

	saveSettings();
}

function setAutoSave(interval) {

	if(undefined != interval) {

		let minutes = 0;
		minutes = interval.value * 1;

		if(!Number.isInteger(minutes)) {
			interval.value = "0";
		}
		else {

			if(minutes < 0) {
				interval.value = "0";
			}
			else if(minutes > 60) {
				interval.value = "60";	
			}
		}

		minutes = interval.value * 1;

		SETTINGS.auto_save_interval = minutes;

		log(SETTINGS.auto_save_interval);
		if(0 == minutes) {
			interval.classList.add("input-deactivate");
		}
		else {
			interval.classList.remove("input-deactivate");
		}

		saveSettings();

		// Change auto save interval
		setAutoSaveInterval(minutes);
	}
}

function setAutoSaveInterval(minutes) {

	let minNumber = minutes * 1;

	if(Number.isInteger(minNumber)) {

		// Clear current timer
		if(null != GLOBAL_VARIABLE.auto_save_timer) {
			clearInterval(GLOBAL_VARIABLE.auto_save_timer);
		}

		let milliSecond = minNumber * 60 * 1000;

		// Set timer if set auto save interval
		if(0 < milliSecond) {
			GLOBAL_VARIABLE.auto_save_timer = setInterval(saveTodo, milliSecond);
			log("SET INTERVAL for AUTO SAVE by = " + minNumber + " / ID = " + GLOBAL_VARIABLE.auto_save_timer);
		}
	}
}

function setShowTooltip(checkbox) {

	if(undefined == checkbox || null == checkbox) {
		SETTINGS.tooltip = !SETTINGS.tooltip;
	}
	else {
		SETTINGS.tooltip = checkbox.checked;
	}

	log(SETTINGS.tooltip);

	setTooltipText();
	saveSettings();
}