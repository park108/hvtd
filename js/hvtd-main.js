window.onload = function() {

	log();

	// Set event listners
	document.body.addEventListener("keydown", keyInCommon, false);
	document.addEventListener("touchstart", handleTouchStart, false);
	document.addEventListener("touchend", handleTouchEnd, false);
	E("navigation-toolbar-today").addEventListener("click", setToday, false);
	E("navigation-toolbar-copy").addEventListener("click", loadPreviousTodo, false);
	E("navigation-toolbar-calendar").addEventListener("click", setCalendarVisibility, false);
	E("navigation-toolbar-clear").addEventListener("click", deleteTodo, false);
	E("navigation-toolbar-save").addEventListener("click", saveTodoAsyc, false);
	E("navigation-toolbar-expandall").addEventListener("click", expandAll, false);
	E("navigation-toolbar-collapseall").addEventListener("click", collapseAll, false);
	E("modal-close").addEventListener("click", closeModal, false);
	E("settings-close").addEventListener("click", closeSettings, false);
	E("settings-close-button").addEventListener("click", closeSettings, false);

	// Set test data
	if(undefined != window.setTestData) {
		window.setTestData();
	}

	// Clear todo and set user info
	clearTodo();
	setTodayIconDate();
	setUserInfo();
}

window.onbeforeunload = function(e) {

	return isChanged() ? getMessage("005") : null;
}

window.onresize = function() {

	if(null != GLOBAL_VARIABLE.resize_timer) {
    	clearTimeout(GLOBAL_VARIABLE.resize_timer);
    }

    GLOBAL_VARIABLE.resize_timer = setTimeout(afterResize, 200);
}

window.onclick = function(e) {

	// Close modal
	let modal = E("modal");

	if(e.target == modal && "" != USER.token && null != USER.token) {
		closeModal();
	}

	// Close user dropdown menu
	let userIconImage = E("user-icon-image");
	let userIcon = E("user-icon");
	let userDropdown = E("user-dropdown");

	if(undefined != userDropdown
		&& userDropdown.style.display == "block"
		&& e.target != userIcon
		&& e.target != userIconImage
		&& e.target.id.indexOf("user-dropdown") < 0) {

		toggleUserDropdown();
	}

	// Close more dropdown menu
	let moreButton = E("navigation-toolbar-more");
	let moreDropdown = E("more-dropdown");
	if(undefined != moreButton
		&& undefined != moreDropdown
		&& e.target != moreButton
		&& e.target.id.indexOf("more-dropdown") < 0) {

		log(e.target.id);

		closeMoreDropdown();
	}

	// Close settings
	let settings = E("settings");

	if(e.target == settings) {
		closeSettings();
	}
}
