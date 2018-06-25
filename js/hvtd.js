function keyInCommon(e) {

	// Ctrl + S: Save
	if(e.ctrlKey && 83 == e.which) {
		saveTodo();
		return false;
	}

	// Ctrl + Shift + C: Calendar expand/collapse
	else if(e.ctrlKey &&  e.shiftKey && 67 == e.which) {
		setCalendarVisibility();
		return false;
	}
}

function keyInContents(e) {

	let currentNode = window.getSelection().focusNode.parentNode;

	if(-1 < currentNode.id.indexOf("contents")) {
		currentNode = currentNode.parentNode;
	}
	
	// Enter
	if(13 == e.which) {
		createNode(currentNode);
		return false;
	}

	// Tab
	else if(9 == e.which) {

		if(e.shiftKey) {
			setNodeLevel(currentNode, -1);
		}
		else {
			setNodeLevel(currentNode, 1);
		}

		refreshNode(currentNode);

		return false;
	}

	// Space
	else if(32 == e.which) {
		if(0 == getCaretOffset()) {

			if(e.shiftKey) {
				setNodeLevel(currentNode, -1);
				refreshNode(currentNode);
				return false;
			}
			else {
				setNodeLevel(currentNode, 1);
				refreshNode(currentNode);
				return false;
			}
		}
	}

	// Backspace
	else if(8 == e.which) {

		if(0 == getCaretOffset() ) {

			if(isNodeCanDelete(currentNode) && 0 == getContents(currentNode).innerHTML.length) {

				if(hasChildNode(currentNode)) {

					openModal(getMessage("001")
						, function() {
							deleteNode(currentNode, e.which);
							closeModal();
						}, closeModal);

				}
				else {
					deleteNode(currentNode, e.which);
				}
			}

			return false;
		}
	}

	// Delete
	else if(46 == e.which) {

		if(0 == getCaretOffset()) {

			if(isNodeCanDelete(currentNode) && 0 == getContents(currentNode).innerHTML.length) {
			
				if(hasChildNode(currentNode)) {

					openModal(getMessage("001")
						, function() {
							deleteNode(currentNode, e.which);
							closeModal();
						}, closeModal);

				}
				else {
					deleteNode(currentNode, e.which);
				}
			}

			return false;
		}
	}

	// Left arrow
	else if(37 == e.which) {

		// When caret is first position of Node
		if(0 == getCaretOffset()) {

			if(hasChildNode(currentNode)) {

				let collapse = E("collapse" + currentNode.id);

				if(!collapse.checked) {
					collapse.checked = true;
					executeToobarCommand(collapse);
					return false;
				}
				else {
					movePreviousNode(currentNode, true);
					return false;
				}
			}
			else {
				movePreviousNode(currentNode, true);
				return false;
			}
		}
	}

	// Right arrow
	else if(39 == e.which) {

		let children = getContents(currentNode).childNodes;
		let cnt = children.length;
		let lastString = (0 == cnt) ? "" : children[cnt - 1];

		// When caret is last position of Node
		if(lastString.length == getCaretOffset()) {

			if(hasChildNode(currentNode)) {

				let collapse = E("collapse" + currentNode.id);

				if(collapse.checked) {
					collapse.checked = false;
					executeToobarCommand(collapse);
					return false;
				}
				else {
					moveNextNode(currentNode);
					return false;
				}
			}
			else {
				moveNextNode(currentNode);
				return false;
			}
		}
	}

	// Up arrow
	else if(38 == e.which) {

		if(e.shiftKey) {
			moveNodeToPrevious(currentNode);
		}
		else {
			movePreviousNode(currentNode);
		}

		return false;
	}

	// Down arrow
	else if(40 == e.which) {

		if(e.shiftKey) {
			moveNodeToNext(currentNode);
		}
		else {
			moveNextNode(currentNode);
		}

		return false;
	}
}

function setSelectedDate() {

	let d = GLOBAL_VARIABLE.selected_date;

	if(null == d) {
		GLOBAL_VARIABLE.selected_date = new Date();
		d = GLOBAL_VARIABLE.selected_date;
	}

	let date = d.getDate();
	let day = d.getDay();
	let year = d.getFullYear();
	let month = d.getMonth() + 1;

	if(month < 10) {
		month = "0" + month;
	}

	if(date < 10) {
		date = "0" + date;
	}

	let selectedDateString = year + "-" + month + "-" + date;
	let weekString = "(" + getWeekText(day) + ")";

	E("selected-date").innerHTML = selectedDateString + " " + weekString;

	log(selectedDateString + " " + weekString)
}

function setDate(year, month, date) {

	saveTodo();

	GLOBAL_VARIABLE.selected_date = new Date(year, month, date);
	createCalendar(GLOBAL_VARIABLE.selected_date);

	setChanged(false);

	clearTodo();
	setSelectedDate();
	loadTodo();
}

function setUserInfo() {

	// Initialize user-info
	E("user-info").innerHTML = "";

	// If has no token, pop signin up
	if(null == USER.token || "" == USER.token) {

		openModal(getMessage("000"));
	}

	// If has token, create user-icon image and sign-out button in user-info element
	else {

		loadSettings();
	}
}

function createUserInfo() {

	let userIcon = document.createElement("img");
	userIcon.setAttribute("id", "user-icon");
	userIcon.setAttribute("src", USER.image);
	userIcon.setAttribute("onclick", "toggleUserDropdown()");

	let userDropdownIcon = document.createElement("img");
	userDropdownIcon.setAttribute("id", "user-dropdown-icon");
	userDropdownIcon.setAttribute("src", USER.image);

	let userDropdownName = document.createElement("div");
	userDropdownName.setAttribute("id", "user-dropdown-name");
	userDropdownName.innerHTML = USER.name;

	let userDropdownId = document.createElement("div");
	userDropdownId.setAttribute("id", "user-dropdown-id");
	userDropdownId.innerHTML = USER.id;

	let userDropdownInfo = document.createElement("div");
	userDropdownInfo.setAttribute("id", "user-dropdown-info");
	userDropdownInfo.appendChild(userDropdownIcon);
	userDropdownInfo.appendChild(userDropdownName);
	userDropdownInfo.appendChild(userDropdownId);

	let userDropdownSettings = document.createElement("a");
	userDropdownSettings.setAttribute("id", "user-dropdown-settings");
	userDropdownSettings.setAttribute("href", "#");
	userDropdownSettings.setAttribute("onclick", "openSettings()");
	userDropdownSettings.innerHTML = getText("USER_DROPDOWN_SETTINGS");

	let userDropdownSignout = document.createElement("a");
	userDropdownSignout.setAttribute("id", "user-dropdown-signout");
	userDropdownSignout.setAttribute("href", "#");
	userDropdownSignout.setAttribute("onclick", "signOut()");
	userDropdownSignout.innerHTML = getText("USER_DROPDOWN_SIGNOUT");

	let userDropdown = document.createElement("div");
	userDropdown.setAttribute("id", "user-dropdown");
	userDropdown.appendChild(userDropdownInfo);
	userDropdown.appendChild(userDropdownSettings);
	userDropdown.appendChild(userDropdownSignout);

	let userInfo = E("user-info");
	userInfo.appendChild(userIcon);
	userInfo.appendChild(userDropdown);

	log("Created for " + USER.name);
}

function openSettings() {

	// Close user dropdown menu
	toggleUserDropdown();

	// Open settings
	let settings = E("settings");
	settings.style.display = "block";

	// Set settings title
	let settingsTitle = E("settings-title");
	settingsTitle.innerHTML = getText("USER_DROPDOWN_SETTINGS");

	// Create settings item
	// 1. Language
	let settingsItem_language_ko = document.createElement("option");
	settingsItem_language_ko.setAttribute("value", "KO");
	settingsItem_language_ko.innerHTML = getText("LANGUAGE_KO");
	if("KO" == SETTINGS.language) {
		settingsItem_language_ko.setAttribute("selected", "true");
	}
	let settingsItem_language_en = document.createElement("option");
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

	let settingsItem_language = getSettingsItem("SETTINGS_LANGUAGE", settingsItem_language_select);

	// 2. Auto collapse
	let settingsItem_collpase_input = document.createElement("input");
	settingsItem_collpase_input.setAttribute("class", "settings-checkbox-slider");
	settingsItem_collpase_input.setAttribute("type", "checkbox");
	settingsItem_collpase_input.setAttribute("onclick", "setAutoCollapse(this)");
	if(SETTINGS.auto_collapse) {
		settingsItem_collpase_input.checked = true;
	}
	else {
		settingsItem_collpase_input.checked = false;
	}

	let settingsItem_collpase_span = document.createElement("span");
	settingsItem_collpase_span.setAttribute("class", "slider");

	let settingsItem_collpase_label = document.createElement("label");
	settingsItem_collpase_label.setAttribute("class", "switch");
	settingsItem_collpase_label.appendChild(settingsItem_collpase_input);
	settingsItem_collpase_label.appendChild(settingsItem_collpase_span);

	let settingsItem_collpase = getSettingsItem("SETTINGS_COLLAPSE", settingsItem_collpase_label);

	// Append settings items
	let settingsList = E("settings-list");
	settingsList.appendChild(settingsItem_language);
	settingsList.appendChild(settingsItem_collpase);
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

function setLanguage(languageSelect) {

	if(undefined != languageSelect) {

		let selectedLanguage = languageSelect.options[languageSelect.selectedIndex].value;
		SETTINGS.language = selectedLanguage;

		log(SETTINGS.language);

		saveSettings();
	}
}

function getSettingsItem(code, value) {

	let itemTitle = document.createElement("div");
	itemTitle.setAttribute("class", "settings-item-title");
	itemTitle.innerHTML = getText(code);

	let itemValue = document.createElement("div");
	itemValue.setAttribute("class", "settings-item-value");
	if(undefined != value && null != value && "" != value) {
		itemValue.appendChild(value);
	}

	let item = document.createElement("div");
	item.setAttribute("class", "settings-item");
	item.appendChild(itemTitle);
	item.appendChild(itemValue);

	return item;
}

function closeSettings() {

	// Remove settings items
	let settingsList = E("settings-list");
	settingsList.innerHTML = "";

	let settings = E("settings");
	settings.style.display = "none";
}

function createCalendar(d) {

	// Get selected date
	let selectedDate = GLOBAL_VARIABLE.selected_date;

	let day = new Date(d.getFullYear(), d.getMonth(), 1).getDay(); 
	let lastMonth = new Date(d.getFullYear(), d.getMonth() - 1, 1);
	let lastDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
	let nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);

	let calendar = E("calendar");
	calendar.innerHTML = "";

	// Add previous month arrow
	let dateObj = document.createElement("span");
	dateObj.classList.add("date");
	dateObj.innerHTML = "< " ;
	dateObj.addEventListener("click", function() {
		createCalendar(lastMonth)
	}, false);
	calendar.appendChild(dateObj);

	// Add month text
	dateObj = document.createElement("span");
	dateObj.classList.add("month-text");
	let yearString = d.getFullYear();
	let monthString = d.getMonth() + 1;
	if(monthString < 10) {
		monthString = "0" + monthString;
	}
	dateObj.innerHTML = yearString + "-" + monthString;
	calendar.appendChild(dateObj);

	// Add next month arrow
	dateObj = document.createElement("span");
	dateObj.classList.add("date");
	dateObj.innerHTML = "> " ;
	dateObj.addEventListener("click", function() {
		createCalendar(nextMonth)
	}, false);
	calendar.appendChild(dateObj);

	// Create current month calendar
	let currentDate = 1;

	while(currentDate <= lastDate.getDate()) {

		dateObj = document.createElement("span");
		dateObj.innerHTML = currentDate + " " ;
		dateObj.classList.add("date");

		if(currentDate == selectedDate.getDate()
			&& d.getFullYear() == selectedDate.getFullYear()
			&& d.getMonth() == selectedDate.getMonth()) {
			dateObj.classList.add("selected-date");
		}

		if(0 == day) {
			dateObj.classList.add("sunday");
		}
		else if(6 == day) {
			dateObj.classList.add("saturday");
		}

		dateObj.setAttribute(
			"onclick"
			, "setDate(" + d.getFullYear() + ", " + d.getMonth() + ", " + currentDate + ")");

		calendar.appendChild(dateObj);

		++currentDate;
		day = ( ++day % 7 );
	}
}

function setCalendarVisibility(show) {

	let header = E("header");
	let calendar = E("calendar");

	if(true == show || "none" == calendar.style.display) {
		calendar.style.display = "block";
		createCalendar(GLOBAL_VARIABLE.selected_date);
	}
	else {
		calendar.style.display = "none";
	}

	setContentsMargin();
}

function setContentsMargin() {

	let header = E("header");
	let contents = E("contents");

	contents.style.marginTop = (header.clientHeight + 5) + "px";
}

function toggleUserDropdown() {

	let menu = E("user-dropdown");

	if("block" == menu.style.display) {
		menu.style.display = "none";
	}
	else {
		menu.style.display = "block";
	}
}

window.onload = function() {

	log();

	// Set event listners
	E("calendar-icon").addEventListener("click", setCalendarVisibility, false);
	E("clear-icon").addEventListener("click", deleteTodo, false);
	document.body.addEventListener("keydown", keyInCommon, false);
	E("modal-close").addEventListener("click", closeModal, false);
	E("settings-close").addEventListener("click", closeSettings, false);

	// Set test data
	if(undefined != window.setTestData) {
		window.setTestData();
	}

	// Clear todo and set user info
	clearTodo();
	setUserInfo();
}

window.onbeforeunload = function(e) {

	let changed = isChanged();

	saveTodo();

	return changed ? getMessage("005") : null;
}

window.onresize = function() {

	setContentsMargin();
}

window.onclick = function(e) {

	// Close modal
	let modal = E("modal");

	if(e.target == modal && "" != USER.token && null != USER.token) {
		closeModal();
	}

	// Close user dropdown menu
	let userIcon = E("user-icon");
	let userDropdown = E("user-dropdown");

	if(userDropdown.style.display == "block"
		&& e.target != userIcon
		&& e.target.id.indexOf("user-dropdown") < 0) {

		toggleUserDropdown();
	}

	// Close settings
	let settings = E("settings");

	if(e.target == settings) {
		closeSettings();
	}
}
