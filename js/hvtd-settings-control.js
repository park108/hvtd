function openSettings() {

	// Set modal open flag
	setModalOpen(true);

	// Close user dropdown menu
	toggleUserDropdown();

	// Create settings
	let settings = document.createElement("div");
	settings.setAttribute("id", "settings");
	document.body.appendChild(settings);

	// Create settings content
	let settingsContent = document.createElement("div");
	settingsContent.setAttribute("id", "settings-content");
	settings.appendChild(settingsContent);

	// Create settings close button
	let settingsClose = document.createElement("span");
	settingsClose.classList.add("close");
	settingsClose.addEventListener("click", closeSettings, false);
	settingsClose.innerHTML = "&times;";
	settingsContent.appendChild(settingsClose);

	// Create settings title
	let settingsTitle = document.createElement("p");
	settingsTitle.setAttribute("id", "settings-title");
	settingsContent.appendChild(settingsTitle);

	// Create settings list
	let settingsList = document.createElement("div");
	settingsList.setAttribute("id", "settings-list");
	settingsList.classList.add("modal-panel");
	settingsContent.appendChild(settingsList);

	// Create ok button
	let settingsOkButton = document.createElement("button");
	settingsOkButton.setAttribute("id", "settings-close-button");
	settingsOkButton.classList.add("button-ok");
	settingsOkButton.classList.add("button-set-single");
	settingsOkButton.addEventListener("click", closeSettings, false);
	settingsContent.appendChild(settingsOkButton);

	// Create settings item
	let select, option, checkbox, span, label, item, div;

	// Language
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

	// Auto collapse
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

	// Show calendar
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

	// Copy completed child
	checkbox = document.createElement("input");
	checkbox.classList.add("settings-checkbox-slider");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("onclick", "setCopyCompletedChild(this)");
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

	item = getSettingsItem("settings-copycompletedchild-label", label);
	settingsList.appendChild(item);

	// Auto save
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

	// Show toolbar
	checkbox = document.createElement("input");
	checkbox.classList.add("settings-checkbox-slider");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("onclick", "setShowToolbar(this)");
	if(SETTINGS.show_toolbar) {
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

	item = getSettingsItem("settings-toolbar-label", label);
	settingsList.appendChild(item);

	// Show tooltip
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
	itemTitle.classList.add("modal-item-title");

	let itemValue = document.createElement("div");
	itemValue.setAttribute("class", "modal-item-value");
	if(undefined != value && null != value && "" != value) {
		itemValue.appendChild(value);
	}

	let item = document.createElement("div");
	item.classList.add("modal-item");
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
	setInnerHtml("settings-copycompletedchild-label", getKeyword("SETTINGS_COPY_COMPLETE_CHILD"));	
	setInnerHtml("settings-autosave-label", getKeyword("SETTINGS_AUTOSAVE"));
	setInnerHtml("settings-autosave-unit", getKeyword("SETTINGS_AUTOSAVE_UNIT"));
	setInnerHtml("settings-toolbar-label", getKeyword("SETTINGS_TOOLBAR"));
	setInnerHtml("settings-tooltip-label", getKeyword("SETTINGS_TOOLTIP"));
	setInnerHtml("settings-close-button", getKeyword("OK"));
}

function closeSettings() {

	// Remove settings window
	let settings = E("settings");

	if(undefined != settings) {
		document.body.removeChild(settings);

		// Remove modal open flag
		setModalOpen(false);
	}
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

function setCopyCompletedChild(checkbox) {

	if(undefined == checkbox || null == checkbox) {
		SETTINGS.copy_complete_child = !SETTINGS.copy_complete_child;
	}
	else {
		SETTINGS.copy_complete_child = checkbox.checked;
	}

	log(SETTINGS.copy_complete_child);

	saveSettings();
}

function setAutoSave(interval) {

	if(undefined != interval) {

		let minutes = 0;
		minutes = interval.value * 1;

		if(!isInt(minutes)) {
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

	if(isInt(minNumber)) {

		// Clear current timer
		if(null != GLOBAL_VARIABLE.auto_save_timer) {
			clearInterval(GLOBAL_VARIABLE.auto_save_timer);
		}

		let milliSecond = minNumber * 60 * 1000;

		// Set timer if set auto save interval
		if(0 < milliSecond) {
			GLOBAL_VARIABLE.auto_save_timer = setInterval(saveTodoAsync, milliSecond);
			log("SET INTERVAL for AUTO SAVE by = " + minNumber + " / ID = " + GLOBAL_VARIABLE.auto_save_timer);
		}
	}
}

function setShowToolbar(checkbox) {

	if(undefined == checkbox || null == checkbox) {
		SETTINGS.show_toolbar = !SETTINGS.show_toolbar;
	}
	else {
		SETTINGS.show_toolbar = checkbox.checked;
	}

	log(SETTINGS.show_toolbar);

	saveSettings();

	// Reset toolbar button layout
	setToolbarButtonLayout();
}

function setShowTooltip(checkbox) {

	if(undefined == checkbox || null == checkbox) {
		SETTINGS.tooltip = !SETTINGS.tooltip;
	}
	else {
		SETTINGS.tooltip = checkbox.checked;
	}

	log(SETTINGS.tooltip);

	saveSettings();

	// Reset tooltip text
	setTooltipText();
}