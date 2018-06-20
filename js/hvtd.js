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

		if(undefined == E("user-dropdown")) {
			createUserDropdownMenu();
		}
	}
}

function createUserDropdownMenu() {

	let userIcon = document.createElement("img");
	userIcon.setAttribute("id", "user-icon");
	userIcon.setAttribute("src", USER.image);

	let userDropdownSettings = document.createElement("a");
	userDropdownSettings.setAttribute("id", "user-dropdown-settings");
	userDropdownSettings.setAttribute("href", "#");
	userDropdownSettings.innerHTML = getText("USER_DROPDOWN_SETTINGS");

	let userDropdownSignout = document.createElement("a");
	userDropdownSignout.setAttribute("id", "user-dropdown-signout");
	userDropdownSignout.setAttribute("href", "#");
	userDropdownSignout.setAttribute("onclick", "signOut()");
	userDropdownSignout.innerHTML = getText("USER_DROPDOWN_SIGNOUT");

	let userDropdown = document.createElement("div");
	userDropdown.setAttribute("id", "user-dropdown");
	userDropdown.appendChild(userDropdownSettings);
	userDropdown.appendChild(userDropdownSignout);

	let userInfo = E("user-info");
	userInfo.appendChild(userIcon);
	userInfo.appendChild(userDropdown);

	log("Create user drop down menu for " + USER.name);
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

	log("WINDOW.ONLOAD");
	setSelectedDate();
	clearTodo();

	if(undefined != window.setTestData) {
		window.setTestData();
	}

	setUserInfo();

	if("" != USER.token && null != USER.token) {	
		loadTodo();
	}

	setCalendarVisibility(true);

	// Set event listners
	E("calendar-icon").addEventListener("click", setCalendarVisibility, false);
	E("clear-icon").addEventListener("click", deleteTodo, false);
	document.body.addEventListener("keydown", keyInCommon, false);
	E("modal-close").addEventListener("click", closeModal, false);
	E("user-icon").addEventListener("click", toggleUserDropdown, false);
}

window.onbeforeunload = function(e) {

	saveTodo();
}

window.onresize = function() {

	setContentsMargin();
}

window.onclick = function(e) {

	let modal = E("modal");

	if(e.target == modal && "" != USER.token && null != USER.token) {
		closeModal();
	}
}
