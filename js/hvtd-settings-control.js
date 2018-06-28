function openSettings() {

	// Close user dropdown menu
	toggleUserDropdown();

	// Open settings
	let settings = E("settings");
	settings.style.display = "block";

	// Get settings list
	let settingsList = E("settings-list");

	// Create settings item
	let select, option, checkbox, span, label, item;

	// 1. Language
	select = document.createElement("select");
	select.setAttribute("id", "settings-language");
	select.setAttribute("onchange", "setLanguage(this)");

	option = document.createElement("option");
	option.setAttribute("id", "settings-language-ko");
	option.setAttribute("value", "KO");
	option.innerHTML = getText("LANGUAGE_KO");
	if("KO" == SETTINGS.language) {
		option.setAttribute("selected", "true");
	}
	select.appendChild(option);

	option = document.createElement("option");
	option.setAttribute("id", "settings-language-en");
	option.setAttribute("value", "EN");
	option.innerHTML = getText("LANGUAGE_EN");
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

	// 4. Tooltip
	checkbox = document.createElement("input");
	checkbox.classList.add("settings-checkbox-slider");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("onclick", "setTooltip(this)");
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

	let item;

	// Title
	item = E("settings-title");
	if(undefined != item) {
		item.innerHTML = getText("USER_DROPDOWN_SETTINGS");
	}

	// Language
	item = E("settings-language-label");
	if(undefined != item) {
		item.innerHTML = getText("SETTINGS_LANGUAGE");
	}

	item =  E("settings-language-ko");
	if(undefined != item) {
		item.innerHTML = getText("LANGUAGE_KO");
	}

	item =  E("settings-language-en");
	if(undefined != item) {
		item.innerHTML = getText("LANGUAGE_EN");
	}

	// Auto collapse
	item =  E("settings-autocollapse-label");
	if(undefined != item) {
		item.innerHTML = getText("SETTINGS_COLLAPSE");
	}

	// Show calendar
	item =  E("settings-showcalendar-label");
	if(undefined != item) {
		item.innerHTML = getText("SETTINGS_SHOWCALENDAR");
	}

	// Tooltip
	item =  E("settings-tooltip-label");
	if(undefined != item) {
		item.innerHTML = getText("SETTINGS_TOOLTIP");
	}

	// Close button
	item = E("settings-close-button");
	if(undefined != item) {
		item.innerHTML = getText("OK");
	}
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

function setTooltip(checkbox) {

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