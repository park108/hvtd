function setNavigationLayout() {

	// Calculate room
	let navigation = E("navigation");
	let selectedDate = E("selected-date");
	let userInfo = E("user-info");

	let room = navigation.clientWidth;
	room -= selectedDate.clientWidth;
	room -= userInfo.clientWidth;
	room -= 10; // toolbar padding-left

	log("Available room to display toolbar = " + room);

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
			if("navigation-toolbar-save" == button.id && !isChanged()) {
			}
			else {
				++totalButtons;	
			}
		}
	});	

	log("BUTTON COUNT = " + totalButtons);

	// Display buttons
	let buttonSize = 0;
	remainButtons = totalButtons;

	buttons.forEach(function(button) {

		// Only buttons
		if("DIV" == button.tagName && button.id.indexOf("navigation-toolbar-") > -1) {

			// Hide button
			button.style.display = "none";

			// Show more button if has no room
			if(remainButtons > 1 && room < (buttonSize * 2)) {

				createMoreButton();
			}

			// No change, no show save button
			else if("navigation-toolbar-save" == button.id && !isChanged()) {
			}

			// Show button
			else {

				button.style.display = "block"; // Show
				buttonSize = button.clientWidth;
				room -= buttonSize; // Room shrink..

				--remainButtons; // Remain button decrease
			}
		}
	});
}

function setSaveIconVisibillity() {

	if(isChanged()) {
		E("navigation-toolbar-save").style.display = "block";
	}
	else {
		E("navigation-toolbar-save").style.display = "none";	
	}

	setNavigationLayout();
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

		let anchor;
		let label;
		let shortcut;

		if("none" == E("navigation-toolbar-calendar").style.display) {

			anchor = document.createElement("a");
			anchor.setAttribute("id", "more-dropdown-calendar");
			anchor.setAttribute("href", "#");
			anchor.setAttribute("onclick", "setCalendarVisibility()");

			label = document.createElement("div");
			label.classList.add("dropdown-label");
			label.innerHTML = getKeyword("FOLD_UNFOLD_CALENDAR");

			shortcut = document.createElement("div");
			shortcut.classList.add("dropdown-shortcut");
			shortcut.innerHTML = "Alt C";

			anchor.appendChild(label);
			anchor.appendChild(shortcut);

			moreDropdown.appendChild(anchor);
		}

		if("none" == E("navigation-toolbar-clear").style.display) {

			anchor = document.createElement("a");
			anchor.setAttribute("id", "more-dropdown-clear");
			anchor.setAttribute("href", "#");
			anchor.setAttribute("onclick", "deleteTodo()");

			label = document.createElement("div");
			label.classList.add("dropdown-label");
			label.innerHTML = getKeyword("CLEAR");

			shortcut = document.createElement("div");
			shortcut.classList.add("dropdown-shortcut");
			shortcut.innerHTML = "";

			anchor.appendChild(label);
			anchor.appendChild(shortcut);

			moreDropdown.appendChild(anchor);
		}

		if("none" == E("navigation-toolbar-save").style.display && isChanged()) {

			anchor = document.createElement("a");
			anchor.setAttribute("id", "more-dropdown-save");
			anchor.setAttribute("href", "#");
			anchor.setAttribute("onclick", "saveTodo()");

			label = document.createElement("div");
			label.classList.add("dropdown-label");
			label.innerHTML = getKeyword("SAVE");

			shortcut = document.createElement("div");
			shortcut.classList.add("dropdown-shortcut");
			shortcut.innerHTML = "Alt S";

			anchor.appendChild(label);
			anchor.appendChild(shortcut);

			moreDropdown.appendChild(anchor);
		}

		if("none" == E("navigation-toolbar-expandall").style.display) {

			anchor = document.createElement("a");
			anchor.setAttribute("id", "more-dropdown-expandall");
			anchor.setAttribute("href", "#");
			anchor.setAttribute("onclick", "expandAll()");

			label = document.createElement("div");
			label.classList.add("dropdown-label");
			label.innerHTML = getKeyword("EXPAND_ALL");

			shortcut = document.createElement("div");
			shortcut.classList.add("dropdown-shortcut");
			shortcut.innerHTML = "Alt 1";

			anchor.appendChild(label);
			anchor.appendChild(shortcut);

			moreDropdown.appendChild(anchor);
		}

		if("none" == E("navigation-toolbar-collapseall").style.display) {

			anchor = document.createElement("a");
			anchor.setAttribute("id", "more-dropdown-collapseall");
			anchor.setAttribute("href", "#");
			anchor.setAttribute("onclick", "collapseAll()");

			label = document.createElement("div");
			label.classList.add("dropdown-label");
			label.innerHTML = getKeyword("COLLAPSE_ALL");

			shortcut = document.createElement("div");
			shortcut.classList.add("dropdown-shortcut");
			shortcut.innerHTML = "Alt 2";

			anchor.appendChild(label);
			anchor.appendChild(shortcut);

			moreDropdown.appendChild(anchor);
		}

		moreButton.appendChild(moreDropdown);

		moreDropdown.style.display = "block";
	}
	else {
		moreButton.removeChild(moreDropdown);
	}
}
