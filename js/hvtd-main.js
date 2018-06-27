function setContentsMargin() {

	let header = E("header");
	let contents = E("contents");

	contents.style.marginTop = (header.clientHeight + 5) + "px";
}

let touchSensitivity = 100;
let touchX = null;
let touchY = null;

function handleTouchStart(evt) {
	
	let touches = evt.changedTouches;
	touchX = touches[0].clientX;
	touchY = touches[0].clientY;

	log("COORD = " + touchX + ", " + touchY);
}

function handleTouchEnd(evt) {

	if(null == touchX || null == touchY) {
		return false;
	}

	let touches = evt.changedTouches;
	xDiff = touches[0].clientX - touchX;
	yDiff = touches[0].clientY - touchY;

	log("DIFF = " + xDiff + ", " + yDiff);

	let isHorizontalMove = (Math.abs(xDiff) > Math.abs(yDiff)); 
	let isVerticalMove = !isHorizontalMove;

	let moveRight = isHorizontalMove && xDiff > 0;
	let moveLeft = isHorizontalMove && xDiff < 0;
	let moveUp = isVerticalMove && yDiff < 0;
	let moveDown = isVerticalMove && yDiff > 0;

	if(moveRight && Math.abs(xDiff) > touchSensitivity) {
		setYesterday();
	}
	else if(moveLeft && Math.abs(xDiff) > touchSensitivity) {
		setTomorrow();
	}
	else if(moveUp && Math.abs(yDiff) > touchSensitivity) {
		log("Swipe to Up");
	}
	else if(moveDown && Math.abs(yDiff) > touchSensitivity) {
		log("Swipe to Down");
	}

	touchX = null;
	touchY = null;
}


window.onload = function() {

	log();

	// Set event listners
	document.body.addEventListener("keydown", keyInCommon, false);
	document.addEventListener("touchstart", handleTouchStart, false);
	document.addEventListener("touchend", handleTouchEnd, false);
	E("navigation-toolbar-calendar").addEventListener("click", setCalendarVisibility, false);
	E("navigation-toolbar-clear").addEventListener("click", deleteTodo, false);
	E("navigation-toolbar-save").addEventListener("click", saveTodo, false);
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
	setUserInfo();
}

window.onbeforeunload = function(e) {

	let changed = isChanged();

	saveTodo();

	return changed ? getMessage("005") : null;
}

window.onresize = function() {

	setNavigationLayout();
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

	// Close more dropdown menu
	let moreButton = E("navigation-toolbar-more");
	let moreDropdown = E("more-dropdown");
	if(undefined != moreButton
		&& undefined != moreDropdown
		&& e.target != moreButton
		&& e.target.id.indexOf("more-dropdown") < 0) {

		log(e.target.id);

		toggleMoreDropdown();
	}

	// Close settings
	let settings = E("settings");

	if(e.target == settings) {
		closeSettings();
	}
}
