window.onload = function() {

	// Set convert function for IE
	setForEachFunction();

	// Set event listners
	document.body.addEventListener("keydown", keyInCommon, false);
	document.addEventListener("touchstart", handleTouchStart, false);
	document.addEventListener("touchend", handleTouchEnd, false);
	E("navigation-toolbar-search").addEventListener("click", toggleSearch, false);
	E("navigation-toolbar-today").addEventListener("click", setToday, false);
	E("navigation-toolbar-nodecopy").addEventListener("click", copyNode, false);
	E("navigation-toolbar-nodepaste").addEventListener("click", pasteNode, false);
	E("navigation-toolbar-copy").addEventListener("click", loadPreviousTodo, false);
	E("navigation-toolbar-calendar").addEventListener("click", setCalendarVisibility, false);
	E("navigation-toolbar-clear").addEventListener("click", deleteTodo, false);
	E("navigation-toolbar-save").addEventListener("click", saveTodoAsync, false);
	E("navigation-toolbar-expandall").addEventListener("click", expandAll, false);
	E("navigation-toolbar-collapseall").addEventListener("click", collapseAll, false);
	E("search-execute").addEventListener("click", getSearchResult, false);
	E("search-close").addEventListener("click", closeSearch, false);
	E("shortcut-button").addEventListener("click", openShortcuts, false);

	// Clear todo and set user info
	clearTodo();
	setTodayIconDate();
	setUserInfo();
}

window.onbeforeunload = function(e) {

	return GLOBAL_VARIABLE.changed ? getMessage("005") : null;
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

	if(e.target == modal) {
		closeConfirmModal();
	}

	// Close view shortcuts
	let shortcuts = E("shortcuts");

	if(e.target == shortcuts) {
		closeShortcuts();
	}

	// Close more dropdown menu
	let moreDropdownIconImage = E("more-dropdown-icon");
	if(undefined != moreDropdownIconImage && e.target != moreDropdownIconImage) {
		closeMoreDropdown();
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

	// Close settings
	let settings = E("settings");

	if(e.target == settings) {
		closeSettings();
	}
}