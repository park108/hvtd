function setContentsMargin() {

	let header = E("header");
	let contents = E("contents");

	contents.style.marginTop = (header.clientHeight + 5) + "px";
}

function setSaveIconVisibillity() {

	log();

	if(isChanged()) {
		E("header-toolbar-save").style.display = "block";
	}
	else {
		E("header-toolbar-save").style.display = "none";	
	}
}

window.onload = function() {

	log();

	// Set event listners
	document.body.addEventListener("keydown", keyInCommon, false);
	E("header-toolbar-calendar").addEventListener("click", setCalendarVisibility, false);
	E("header-toolbar-clear").addEventListener("click", deleteTodo, false);
	E("header-toolbar-save").addEventListener("click", saveTodo, false);
	E("modal-close").addEventListener("click", closeModal, false);
	E("settings-close").addEventListener("click", closeSettings, false);
	E("settings-close-button").addEventListener("click", closeSettings, false);

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

	if(undefined != userDropdown
		&& userDropdown.style.display == "block"
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
