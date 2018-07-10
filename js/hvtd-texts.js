let TEXTS = {
	"MESSAGE": {
		"000": {
			"KO": "hvtd에 로그인 하세요.",
			"EN": "Sign in to hvtd."
		}
	}
};

// Get tooltip
function getTooltip(code) {

	return TEXTS.TOOLTIP[code][SETTINGS.language];
}

// Set tooltip text
function setTooltipText() {

	let component;

	if(SETTINGS.tooltip) {
		setDomAttribute("navigation-toolbar-today", "data-tooltip", getTooltip("006"));
		setDomAttribute("navigation-toolbar-search", "data-tooltip", getTooltip("009"));
		setDomAttribute("navigation-toolbar-copy", "data-tooltip", getTooltip("007"));
		setDomAttribute("navigation-toolbar-calendar", "data-tooltip", getTooltip("000"));
		setDomAttribute("navigation-toolbar-clear", "data-tooltip", getTooltip("001"));
		setDomAttribute("navigation-toolbar-save", "data-tooltip", getTooltip("002"));
		setDomAttribute("navigation-toolbar-expandall", "data-tooltip", getTooltip("003"));
		setDomAttribute("navigation-toolbar-collapseall", "data-tooltip", getTooltip("004"));
		setDomAttribute("user-icon", "data-tooltip", getTooltip("005"));
		setDomAttribute("shortcut-button", "data-tooltip", getTooltip("008"));
	}
	else {
		removeDomAttribute("navigation-toolbar-today", "data-tooltip");
		removeDomAttribute("navigation-toolbar-search", "data-tooltip");
		removeDomAttribute("navigation-toolbar-copy", "data-tooltip");
		removeDomAttribute("navigation-toolbar-calendar", "data-tooltip");
		removeDomAttribute("navigation-toolbar-clear", "data-tooltip");
		removeDomAttribute("navigation-toolbar-save", "data-tooltip");
		removeDomAttribute("navigation-toolbar-expandall", "data-tooltip");
		removeDomAttribute("navigation-toolbar-collapseall", "data-tooltip");
		removeDomAttribute("user-icon", "data-tooltip");
		removeDomAttribute("shortcut-button", "data-tooltip");
	}
}

// Get week text
function getWeekText(week) {

	return TEXTS.WEEK_TEXT[week][SETTINGS.language];
}

// Get message
function getMessage(code, param1, param2, param3) {

	// Get default string
	let message = TEXTS.MESSAGE[code][SETTINGS.language];

	// Replace placeholder to parameter
	if(undefined != param1) { message = message.replace("{1}", param1); }
	else { message = message.replace("{1}", ""); }

	if(undefined != param2) { message = message.replace("{2}", param2); }
	else { message = message.replace("{2}", ""); }

	if(undefined != param3) { message = message.replace("{3}", param3); }
	else { message = message.replace("{3}", ""); }

	return message;
}

// Get keyword
function getKeyword(code, param1, param2, param3) {

	// Get default keyword
	let message = TEXTS.KEYWORD[code][SETTINGS.language];

	// Replace placeholder to parameter
	if(undefined != param1) { message = message.replace("{1}", param1); }
	else { message = message.replace("{1}", ""); }

	if(undefined != param2) { message = message.replace("{2}", param2); }
	else { message = message.replace("{2}", ""); }

	if(undefined != param3) { message = message.replace("{3}", param3); }
	else { message = message.replace("{3}", ""); }

	return message;
}
