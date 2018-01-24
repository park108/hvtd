function saveTodo() {
	
	let date = GLOBAL_VARIABLE.selected_date;

	let yearString = date.getFullYear();
	let monthString = date.getMonth();
	let dateString = date.getDate();

	++monthString;
	monthString = (monthString < 10) ? "0" + monthString : monthString;
	dateString = (dateString < 10) ? "0" + dateString : dateString;

	let yyyymmdd = yearString + monthString + dateString;

	let todo = {
		"year": yearString,
		"month": monthString,
		"date": dateString,
		"list": null
	};

	let nodeList = getNodeList();
	let todoList = [];
	let nodeObject;

	nodeList.forEach(function(node) {

		nodeObject = new Object();
		nodeObject.id = node.id;
		nodeObject.level = node.getAttribute("level");
		nodeObject.status = node.getAttribute("status");
		nodeObject.collapse = document.getElementById("collapse" + node.id).checked;
		nodeObject.contents = document.getElementById("contents" + node.id).innerHTML;
		
		todoList.push(nodeObject);
	});

	todo.list = todoList;

	let jsonString = JSON.stringify(todo);

	log("SAVE: " + yyyymmdd + " -> " + jsonString);

	localStorage.setItem(yyyymmdd, jsonString);

	setChanged(false);
}

function loadTodo() {

	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	let data = localStorage.getItem(yyyymmdd);

	// No data
	if(undefined == data || null == data || "" == data) {

		let length = localStorage.length;
		let doConfirm = false;
		let key;
		let previousKey = "00000000";

		// If enabled Auto Copy, get previous todo key (yyyymmdd)
		if(GLOBAL_SETTING.auto_copy && length > 0) {

			for(let i = 0; i < localStorage.length; i++) {

				key = localStorage.key(i);

				if(key < yyyymmdd && previousKey < key) {

					doConfirm = true;
					previousKey = key;
				}
			}
		}


		// Set previous data string for Confirm popup
		let previousDataString;

		if(doConfirm) {

			let previousDateYear = previousKey.substring(0, 4);
			let previousDateMonth = previousKey.substring(4, 6);
			let previousDateDate = previousKey.substring(6, 8);

			log(previousDateYear + "-" + previousDateMonth + "-" + previousDateDate)

			let previousDate = new Date(previousDateYear
				, (previousDateMonth * 1) - 1
				, (previousDateDate * 1));

			let previousDateWeek = getWeekText(previousDate.getDay());

			previousDataString = previousDateYear + "-"
				+ previousDateMonth + "-"
				+ previousDateDate
				+ "(" + previousDateWeek + ")";
		}

		// Copy from previous todo if confirmed
		if(doConfirm && confirm(getMessage("002", previousDataString))) {

			data = localStorage.getItem(previousKey);

			let todo = JSON.parse(data);
			let todoList = todo.list;
			let previousNode = undefined;
			let startDeleteLevel = 9999;

			todoList.forEach(function(node) {

				// Skip completed node
				if("N" == node.status
					&& startDeleteLevel >= node.level) {

					previousNode = createNode(previousNode
						, node.level
						, node.status
						, node.collapse
						, node.contents);

					startDeleteLevel = 9999;
				}
				else {

					if(startDeleteLevel > node.level) {

						startDeleteLevel = node.level;
					}
				}

			});

			setChanged(true);
		}

		// Nop. New todo.
		else {

			createNode();
		}
	}

	// If has data, get that data
	else {

		let todo = JSON.parse(data);
		let todoList = todo.list;
		let previousNode = undefined;

		todoList.forEach(function(node) {
			previousNode = createNode(previousNode
				, node.level
				, node.status
				, node.collapse
				, node.contents);
		});
	}

	log("LOAD: " + yyyymmdd + " -> " + data);
}

function deleteTodo(yyyymmdd) {

	if(confirm(getMessage("004"))) {
		localStorage.removeItem(yyyymmdd);	
	}
}

function keyInCommon(e) {

	// Ctrl + S: Save
	if(e.ctrlKey && 83 == e.which) {

		if(getChanged()) {
			saveTodo();
		}

		return false;
	}

	// Ctrl + Shift + C: Calendar expand/collapse
	else if(e.ctrlKey &&  e.shiftKey && 67 == e.which) {
		showCalendar();
		return false;
	}
}

function keyInContents(e) {

	let currentNode = window.getSelection().focusNode.parentNode;

	if(-1 < currentNode.id.indexOf("contents")) {
		currentNode = currentNode.parentNode;
	}

	// log("KEY_IN: ID = " + currentNode.id + ", KEYCODE = " + e.which);
	
	// Enter
	if(13 == e.which) {

		createNode(currentNode);
		return false;
	}

	// Tab
	else if(9 == e.which) {

		if(e.shiftKey) {
			decreaseNodeLevel(currentNode);
		}
		else {
			increaseNodeLevel(currentNode);
		}
		return false;
	}

	// Backspace
	else if(8 == e.which) {

		log("CONTENTS = '" + getContents(currentNode).innerHTML + "'");

		if(0 == getCaretOffset() && 0 == getContents(currentNode).innerHTML.length) {
			deleteNode(currentNode, false, "BACKSPACE");
			return false;
		}
	}

	// Delete
	else if(46 == e.which) {

		if(0 == getCaretOffset() && 0 == getContents(currentNode).innerHTML.length) {
			deleteNode(currentNode, false, "DELETE");
			return false;
		}
	}

	// Left arrow
	else if(37 == e.which) {

		// When caret is first position of Node
		if(0 == getCaretOffset()) {

			if(hasChildNode(currentNode)) {

				let collapse = document.getElementById("collapse" + currentNode.id);

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

				let collapse = document.getElementById("collapse" + currentNode.id);

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

	document.getElementById("selected-date").innerHTML = selectedDateString + " " + weekString;
}

function setDate(year, month, date) {

	if(getChanged()) {
		saveTodo();
	}

	GLOBAL_VARIABLE.selected_date = new Date(year, month, date);
	createCalendar(GLOBAL_VARIABLE.selected_date);

	setChanged(false);

	init();
}

function createCalendar(d) {

	// Get selected date
	let selectedDate = GLOBAL_VARIABLE.selected_date;

	let day = new Date(d.getFullYear(), d.getMonth(), 1).getDay(); 
	let lastMonth = new Date(d.getFullYear(), d.getMonth() - 1, 1);
	let lastDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
	let nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);

	let calendar = document.getElementById("calendar");
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

function showCalendar(show) {

	let header = document.getElementById("header");
	let calendar = document.getElementById("calendar");

	if(undefined == show) {
		if("none" == calendar.style.display) {
			show = true;
		}
		else {
			show = false;
		}
	}

	if(show) {
		calendar.style.display = "block";
		createCalendar(GLOBAL_VARIABLE.selected_date);
		
	}
	else {
		calendar.style.display = "none";
	}

	setContentsMargin();
}

function setContentsMargin() {

	let contents = document.getElementById("contents");

	contents.style.marginTop = (header.clientHeight + 5) + "px";
}

function clear() {

	let nodeList = getNodeList();
	let contents = document.getElementById("contents");

	nodeList.forEach(function(node) {
		contents.removeChild(node);
	});

	GLOBAL_VARIABLE.node_id = 0;
}

function init() {

	setSelectedDate();
	clear();
	loadTodo();
	showCalendar(true);
}

window.onload = function() {

	init();

	// Set event listners
	document.getElementById("calendar-icon").addEventListener("click"
		, function() {
			showCalendar();
		}, false);

	document.getElementById("clear-icon").addEventListener("click"
		, function() {
			deleteTodo(getYYYYMMDD(GLOBAL_VARIABLE.selected_date));
			init();
		}, false);

	document.body.addEventListener("keydown", keyInCommon, false);
}

window.onbeforeunload = function(e) {

	if(getChanged()) {
		saveTodo();
	}
};

window.onresize = function() {

	setContentsMargin();
}