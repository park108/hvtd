function setToolbarButtonLayout() {

	// Calculate room
	let navigation = E("navigation");
	let selectedDate = E("selected-date");
	let userInfo = E("user-info");

	let room = navigation.clientWidth;
	room -= selectedDate.clientWidth;
	room -= userInfo.clientWidth;
	room -= 10; // toolbar padding-left

	// Remove more button
	removeMoreButton();

	// Count to display butons
	let toolbar = E("navigation-toolbar");
	let buttons = toolbar.childNodes;
	let totalButtons = 0;
	let remainButtons = 0;

	buttons.forEach(function(button) {

		// Only buttons
		if("DIV" == button.tagName && button.id.indexOf("navigation-toolbar-") > -1) {

			// No change, no show save button
			if("navigation-toolbar-save" == button.id && !GLOBAL_VARIABLE.changed) {
			}
			else {
				++totalButtons;	
			}
		}
	});

	// Display buttons
	let buttonSize = 30;
	let index = 0;
	remainButtons = totalButtons;

	buttons.forEach(function(button) {

		// Only buttons
		if("DIV" == button.tagName && button.id.indexOf("navigation-toolbar-") > -1) {

			// Hide button
			button.style.display = "none";

			// If set hide toolbar, show only more button
			if(!SETTINGS.show_toolbar) {
				if(0 == index) {
					createMoreButton();
				}
			}

			else {

				// Show more button if has no room
				if(remainButtons > 1 && room < (buttonSize * 2)) {
					createMoreButton();
				}

				// No change, no show save button
				else if("navigation-toolbar-save" == button.id && !GLOBAL_VARIABLE.changed) {
				}

				// No copied node, no show node paste button
				else if("navigation-toolbar-nodepaste" == button.id && GLOBAL_VARIABLE.copied_node == null) {
				}

				// Show button
				else {

					button.style.display = "block"; // Show
					buttonSize = button.clientWidth;
					room -= buttonSize; // Room shrink..

					--remainButtons; // Remain button decrease
				}
			}

			++index;
		}
	});
}

function setSaveIconVisibillity() {

	if(GLOBAL_VARIABLE.changed) {
		E("navigation-toolbar-save").style.display = "block";
	}
	else {
		E("navigation-toolbar-save").style.display = "none";	
	}

	setToolbarButtonLayout();
}

function createMoreButton() {

	let moreDiv = E("navigation-toolbar-more");

	if(undefined == moreDiv) {

		let moreIcon = document.createElement("img");
		moreIcon.setAttribute("id", "more-dropdown-icon");
		moreIcon.setAttribute("src", "icons/more.svg");

		moreDiv = document.createElement("div");
		moreDiv.setAttribute("id", "navigation-toolbar-more");
		moreDiv.setAttribute("onclick", "toggleMoreDropdown()");
		moreDiv.appendChild(moreIcon);

		let toolbar = E("navigation-toolbar");
		toolbar.appendChild(moreDiv);

		moreDiv.style.display = "block";
	}
}

function removeMoreButton() {

	let moreDiv = E("navigation-toolbar-more");

	if(undefined != moreDiv) {

		let toolbar = E("navigation-toolbar");
		toolbar.removeChild(moreDiv);
	}
}

function toggleMoreDropdown() {

	let moreDropdown = E("more-dropdown");
	let moreButton = E("navigation-toolbar-more");

	if(undefined == moreDropdown) {

		moreDropdown = document.createElement("div");
		moreDropdown.setAttribute("id", "more-dropdown");
		moreDropdown.classList.add("dropdown");
		moreButton.appendChild(moreDropdown);

		createMoreDropdownItem("navigation-toolbar-search", "more-dropdown-search", openSearch, "SEARCH", "Alt F");
		createMoreDropdownItem("navigation-toolbar-today", "more-dropdown-today", setToday, "GO_TODAY", "Alt T");
		createMoreDropdownItem("navigation-toolbar-nodecopy", "more-dropdown-nodecopy", copyNode, "COPY_NODE", "");

		if(null != GLOBAL_VARIABLE.copied_node) {
			createMoreDropdownItem("navigation-toolbar-nodepaste", "more-dropdown-nodepaste", pasteNode, "PASTE_NODE", "");
		}

		createMoreDropdownItem("navigation-toolbar-copy", "more-dropdown-copy", loadPreviousTodo, "COPY_PREVIOUS", "");

		if(GLOBAL_VARIABLE.changed) {
			createMoreDropdownItem("navigation-toolbar-save", "more-dropdown-save", saveTodoAsync, "SAVE", "Alt S");
		}

		createMoreDropdownItem("navigation-toolbar-clear", "more-dropdown-clear", deleteTodo, "CLEAR", "");
		createMoreDropdownItem("navigation-toolbar-calendar", "more-dropdown-calendar", setCalendarVisibility, "TOGGLE_CALENDAR", "Alt C");
		createMoreDropdownItem("navigation-toolbar-expandall", "more-dropdown-expandall", expandAll, "EXPAND_ALL", "Alt 1");
		createMoreDropdownItem("navigation-toolbar-collapseall", "more-dropdown-collapseall", collapseAll, "COLLAPSE_ALL", "Alt 2");		

		moreDropdown.style.display = "block";
	}
	else {
		moreButton.removeChild(moreDropdown);
	}
}

function createMoreDropdownItem(toolbarButtonId, dropdownMenuId, clickEventHandler, keyword, shortcutKey) {
	
	if("none" == E(toolbarButtonId).style.display) {

		// Create anchor tag for menu box
		let anchor = document.createElement("a");
		anchor.setAttribute("id", dropdownMenuId);
		anchor.addEventListener("click", clickEventHandler, false);

		// Create label
		let label = document.createElement("div");
		label.classList.add("dropdown-label");
		label.innerHTML = getKeyword(keyword);
		anchor.appendChild(label);

		// Create shortcut if is not Mobile
		if(!isMobile() && undefined != shortcutKey && null != shortcutKey && "" != shortcutKey) {

			let shortcut = document.createElement("div");
			shortcut.classList.add("shortcut");
			shortcut.innerHTML = shortcutKey;
			anchor.appendChild(shortcut);
		}

		// Append more dropdown menu
		let moreDropdown = E("more-dropdown");
		moreDropdown.appendChild(anchor);
	}
}

function closeMoreDropdown() {

	let moreButton = E("navigation-toolbar-more");
	let moreDropdown = E("more-dropdown");

	if(undefined != moreButton && undefined != moreDropdown) {

		moreButton.removeChild(moreDropdown);
	}
}

function setTodayIconDate() {

	E("toolbar-icon-today").innerHTML = new Date().getDate();
}

function openShortcuts() {

	// Set modal open flag
	setModalOpen(true);

	// Create modal
	let shortcuts = document.createElement("div");
	shortcuts.setAttribute("id", "shortcuts");
	shortcuts.classList.add("modal");
	shortcuts.style.display = "block";
	document.body.appendChild(shortcuts);

	// Create content
	let content = document.createElement("div");
	content.classList.add("modal-content");
	shortcuts.appendChild(content);

	// Create settings close button
	let close = document.createElement("span");
	close.classList.add("close");
	close.addEventListener("click", closeShortcuts, false);
	close.innerHTML = "&times;";
	content.appendChild(close);

	// Create shortcuts in todo
	let title = document.createElement("p");
	title.innerHTML = getKeyword("SHORTCUTS_IN_TODO");
	content.appendChild(title);

	let shortcutsInTodo = document.createElement("div");
	shortcutsInTodo.classList.add("modal-panel");
	content.appendChild(shortcutsInTodo);

	shortcutsInTodo.appendChild(createShortcutItem(getKeyword("ADD_LEVEL"), "Tab"));
	shortcutsInTodo.appendChild(createShortcutItem(getKeyword("SUBTRACT_LEVEL"), "Shift Tab"));
	shortcutsInTodo.appendChild(createShortcutItem(getKeyword("GO_FIRST"), "Ctrl ↑"));
	shortcutsInTodo.appendChild(createShortcutItem(getKeyword("GO_LAST"), "Ctrl ↓"));
	shortcutsInTodo.appendChild(createShortcutItem(getKeyword("MOVE_UP"), "Shift ↑"));
	shortcutsInTodo.appendChild(createShortcutItem(getKeyword("MOVE_DOWN"), "Shift ↓"));

	// Create shortcuts in common
	title = document.createElement("p");
	title.innerHTML = getKeyword("SHORTCUTS_IN_COMMON");
	content.appendChild(title);

	let shortcutssInCommon = document.createElement("div");
	shortcutssInCommon.classList.add("modal-panel");
	content.appendChild(shortcutssInCommon);

	shortcutssInCommon.appendChild(createShortcutItem(getKeyword("SEARCH"), "Alt F"));
	shortcutssInCommon.appendChild(createShortcutItem(getKeyword("GO_TODAY"), "Alt T"));
	shortcutssInCommon.appendChild(createShortcutItem(getKeyword("GO_YESTERDAY"), "Ctrl Alt ←"));
	shortcutssInCommon.appendChild(createShortcutItem(getKeyword("GO_TOMORROW"), "Ctrl Alt →"));
	shortcutssInCommon.appendChild(createShortcutItem(getKeyword("TOGGLE_CALENDAR"), "Alt C"));
	shortcutssInCommon.appendChild(createShortcutItem(getKeyword("SAVE"), "Alt S"));
	shortcutssInCommon.appendChild(createShortcutItem(getKeyword("EXPAND_ALL"), "Alt 1"));
	shortcutssInCommon.appendChild(createShortcutItem(getKeyword("COLLAPSE_ALL"), "Alt 2"));

	// Create ok button
	let okButton = document.createElement("button");
	okButton.classList.add("button-ok");
	okButton.classList.add("button-set-single");
	okButton.addEventListener("click", closeShortcuts, false);
	okButton.innerHTML = getKeyword("OK");
	content.appendChild(okButton);
}

function showShortcutButton() {

	let button = E("shortcut-button");

	if(undefined != button) {
		button.style.display = "block";
	}
}

function createShortcutItem(desc, key) {

	let item = document.createElement("div");
	item.classList.add("shortcut-item");

	let description = document.createElement("span");
	description.classList.add("shortcut-item-title");
	description.innerHTML = desc;

	let shortcut = document.createElement("span");
	shortcut.classList.add("shortcut");
	shortcut.innerHTML = key;

	item.appendChild(description);
	item.appendChild(shortcut);

	return item;
}

function closeShortcuts() {

	let shorcuts = E("shortcuts");

	if(undefined != shortcuts) {
		document.body.removeChild(shortcuts);

		// Remove modal open flag
		setModalOpen(false);
	}
}