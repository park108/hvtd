function openSettings() {

	// Close user dropdown menu
	toggleUserDropdown();

	// Open settings
	let settings = E("settings");
	settings.style.display = "block";

	// Create settings item
	// 1. Language
	let settingsItem_language_ko = document.createElement("option");
	settingsItem_language_ko.setAttribute("id", "settings-language-ko");
	settingsItem_language_ko.setAttribute("value", "KO");
	settingsItem_language_ko.innerHTML = getText("LANGUAGE_KO");
	if("KO" == SETTINGS.language) {
		settingsItem_language_ko.setAttribute("selected", "true");
	}
	let settingsItem_language_en = document.createElement("option");
	settingsItem_language_en.setAttribute("id", "settings-language-en");
	settingsItem_language_en.setAttribute("value", "EN");
	settingsItem_language_en.innerHTML = getText("LANGUAGE_EN");
	if("EN" == SETTINGS.language) {
		settingsItem_language_en.setAttribute("selected", "true");
	}

	let settingsItem_language_select = document.createElement("select");
	settingsItem_language_select.setAttribute("id", "settings-language");
	settingsItem_language_select.setAttribute("onchange", "setLanguage(this)");
	settingsItem_language_select.appendChild(settingsItem_language_ko);
	settingsItem_language_select.appendChild(settingsItem_language_en);

	let settingsItem_language = getSettingsItem("settings-language-label", settingsItem_language_select);

	// 2. Auto collapse
	let settingsItem_collpase_input = document.createElement("input");
	settingsItem_collpase_input.classList.add("settings-checkbox-slider");
	settingsItem_collpase_input.setAttribute("type", "checkbox");
	settingsItem_collpase_input.setAttribute("onclick", "setAutoCollapse(this)");
	if(SETTINGS.auto_collapse) {
		settingsItem_collpase_input.checked = true;
	}
	else {
		settingsItem_collpase_input.checked = false;
	}

	let settingsItem_collpase_span = document.createElement("span");
	settingsItem_collpase_span.classList.add("slider");

	let settingsItem_collpase_label = document.createElement("label");
	settingsItem_collpase_label.classList.add("switch");
	settingsItem_collpase_label.appendChild(settingsItem_collpase_input);
	settingsItem_collpase_label.appendChild(settingsItem_collpase_span);

	let settingsItem_collpase = getSettingsItem("settings-autocollapse-label", settingsItem_collpase_label);

	// 3. Tooltip
	let settingsItem_tooltip_input = document.createElement("input");
	settingsItem_tooltip_input.classList.add("settings-checkbox-slider");
	settingsItem_tooltip_input.setAttribute("type", "checkbox");
	settingsItem_tooltip_input.setAttribute("onclick", "setTooltip(this)");
	if(SETTINGS.tooltip) {
		settingsItem_tooltip_input.checked = true;
	}
	else {
		settingsItem_tooltip_input.checked = false;
	}

	let settingsItem_tooltip_span = document.createElement("span");
	settingsItem_tooltip_span.classList.add("slider");

	let settingsItem_tooltip_label = document.createElement("label");
	settingsItem_tooltip_label.classList.add("switch");
	settingsItem_tooltip_label.appendChild(settingsItem_tooltip_input);
	settingsItem_tooltip_label.appendChild(settingsItem_tooltip_span);

	let settingsItem_tooltip = getSettingsItem("settings-tooltip-label", settingsItem_tooltip_label);

	// Append settings items
	let settingsList = E("settings-list");
	settingsList.appendChild(settingsItem_language);
	settingsList.appendChild(settingsItem_collpase);
	settingsList.appendChild(settingsItem_tooltip);

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

	// Title
	let settingsTitle = E("settings-title");
	if(undefined != settingsTitle) {
		settingsTitle.innerHTML = getText("USER_DROPDOWN_SETTINGS");
	}

	// Language
	let settingsLangaugeLabel = E("settings-language-label");
	if(undefined != settingsLangaugeLabel) {
		settingsLangaugeLabel.innerHTML = getText("SETTINGS_LANGUAGE");
	}

	let settingsLanguageKo =  E("settings-language-ko");
	if(undefined != settingsLanguageKo) {
		settingsLanguageKo.innerHTML = getText("LANGUAGE_KO");
	}

	let settingsLanguageEn =  E("settings-language-en");
	if(undefined != settingsLanguageEn) {
		settingsLanguageEn.innerHTML = getText("LANGUAGE_EN");
	}

	// Auto collapse
	let settingsAutoCollapse =  E("settings-autocollapse-label");
	if(undefined != settingsAutoCollapse) {
		settingsAutoCollapse.innerHTML = getText("SETTINGS_COLLAPSE");
	}

	// Tooltip
	let settingsTooltip =  E("settings-tooltip-label");
	if(undefined != settingsTooltip) {
		settingsTooltip.innerHTML = getText("SETTINGS_TOOLTIP");
	}

	// Close button
	let settingsCloseButton = E("settings-close-button");
	if(undefined != settingsCloseButton) {
		settingsCloseButton.innerHTML = getText("OK");
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