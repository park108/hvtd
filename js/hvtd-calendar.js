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

function setSelectedDateText() {

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

	log(selectedDateString + " " + weekString);
}

function setDate(year, month, date) {

	// Check semaphore
	if(!GLOBAL_VARIABLE.now_loading) {

		saveTodo();

		GLOBAL_VARIABLE.selected_date = new Date(year, month, date);
		createCalendar(GLOBAL_VARIABLE.selected_date);

		setChanged(false);
		setSaveIconVisibillity();

		clearTodo();
		setSelectedDateText();
		loadTodo();
	}
	else {
		log("Now loading... Can't move another todo");
	}
}

function setYesterday() {

	// Check semaphore
	if(!GLOBAL_VARIABLE.now_loading) {

		saveTodo();

		let yesterday = GLOBAL_VARIABLE.selected_date;
		yesterday.setDate(yesterday.getDate() - 1);

		setDate(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
	}
	else {
		log("Now loading... Can't move yesterday");
	}
}

function setTomorrow() {

	// Check semaphore
	if(!GLOBAL_VARIABLE.now_loading) {

		saveTodo();

		let tomorrow = GLOBAL_VARIABLE.selected_date;
		tomorrow.setDate(tomorrow.getDate() + 1);

		setDate(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
	}
	else {
		log("Now loading... Can't move tomorrow");
	}
}

function setToday() {

	// Check semaphore
	if(!GLOBAL_VARIABLE.now_loading) {

		let today = new Date();

		if(GLOBAL_VARIABLE.selected_date.getFullYear() == today.getFullYear()
			&& GLOBAL_VARIABLE.selected_date.getMonth() == today.getMonth()
			&& GLOBAL_VARIABLE.selected_date.getDate() == today.getDate()) {

			log("Already today!");
		}
		else {

			saveTodo();
			setDate(today.getFullYear(), today.getMonth(), today.getDate());
		}
	}
	else {
		log("Now loading... Can't move today");
	}
}