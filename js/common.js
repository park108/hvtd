let SETTINGS = {
	"log": true,
	"language": "EN",
	"auto_copy": true,
	"auto_collapse": true,
}

let GLOBAL_VARIABLE = {
	"node_id": 0,
	"changed": false,
	"selected_date": null,
}

let USER = {
	"id": "",
	"name": "",
	"token": "",
	"image": ""
}

let IMG = {
	"icon_collapse": "<img src='./icons/minus.svg' />",
	"icon_expand": "<img src='./icons/plus.svg' />",
	"icon_done": "<img src='./icons/check.svg' />",
	"icon_done_no": "<img src='./icons/check_false.svg' />",
	"icon_cancel": "<img src='./icons/cross.svg' />",
	"icon_cancel_no": "<img src='./icons/cross_false.svg' />",
}

function log(line) {
	if(SETTINGS.log) {
		console.log(line);
	}
}

function E(id) {
	return document.getElementById(id);
}

function getMessage(code, param1, param2, param3) {

	if("000" == code) {
		if("KO" == SETTINGS.language) return "hvtd에 로그인 하세요.";
		else if("EN" == SETTINGS.language) return "Sign in to hvtd";
		else return "Sign in to hvtd";	
	}
	else if("001" == code) {
		if("KO" == SETTINGS.language) return "하위 항목까지 모두 삭제 하시겠습니까?";
		else if("EN" == SETTINGS.language) return "It has children. Do you delete it?";
		else return "It has children. Do you delete it?";
	}
	else if("002" == code) {
		if("KO" == SETTINGS.language) return "이전 데이터를 복사하시겠습니까? (" + param1 + ")";
		else if("EN" == SETTINGS.language) return "Do you copy last todo?(" + param1 + ")";
		else return "Do you copy last todo?(" + param1 + ")";
	}
	else if("003" == code) {
		if("KO" == SETTINGS.language) return "";
		else if("EN" == SETTINGS.language) return "";
		else return "";	
	}
	else if("004" == code) {
		if("KO" == SETTINGS.language) return "초기화 하시겠습니까?";
		else if("EN" == SETTINGS.language) return "Do you clear data?";
		else return "Do you clear data?";	
	}
}

function getWeekText(week) {
	if(0 == week) {
		if("KO" == SETTINGS.language) return "일";
		else if("EN" == SETTINGS.language) return "SUN";
		else return "SUN";
	}
	else if(1 == week) {
		if("KO" == SETTINGS.language) return "월";
		else if("EN" == SETTINGS.language) return "MON";
		else return "SUN";
	}
	else if(2 == week) {
		if("KO" == SETTINGS.language) return "화";
		else if("EN" == SETTINGS.language) return "TUE";
		else return "TUE";
	}
	else if(3 == week) {
		if("KO" == SETTINGS.language) return "수";
		else if("EN" == SETTINGS.language) return "WED";
		else return "WED";
	}
	else if(4 == week) {
		if("KO" == SETTINGS.language) return "목";
		else if("EN" == SETTINGS.language) return "THU";
		else return "THU";
	}
	else if(5 == week) {
		if("KO" == SETTINGS.language) return "금";
		else if("EN" == SETTINGS.language) return "FRI";
		else return "FRI";
	}
	else if(6 == week) {
		if("KO" == SETTINGS.language) return "토";
		else if("EN" == SETTINGS.language) return "SAT";
		else return "SAT";
	}
}

function isChanged() {
	return GLOBAL_VARIABLE.changed;	
}

function setChanged(isChanged) {

	if(GLOBAL_VARIABLE.changed != isChanged) {

		GLOBAL_VARIABLE.changed = isChanged;
	}
}

function getCaretOffset() {

	let selection = window.getSelection();

	if(selection.getRangeAt) {
		return selection.getRangeAt(0).endOffset;
	}
	else {
		return -1;
	}
}

function getYYYYMMDD(inputDate) {
	
	let year = inputDate.getFullYear();
	let month = inputDate.getMonth() + 1;
	let date = inputDate.getDate();

	if(month < 10) {
		month = "0" + month;
	}

	if(date < 10) {
		date = "0" + date;
	}

	return year + month + date;
}

function openModal(message, callback1, callback2) {

	let modal = E("modal");
	let messageDom = E("modal-message");

	messageDom.innerHTML = message;
	modal.style.display = "block";

	// Set button OK
	let newButton;
	let buttonOk = E("modal-ok");

	if(undefined == callback1 || null == callback1) {
		buttonOk.style.display = "none";
	}
	else {
		buttonOk.style.display = "";
		newButton = buttonOk.cloneNode(true); // For reset event listner
		buttonOk.parentNode.replaceChild(newButton, buttonOk);
		newButton.addEventListener("click", callback1, false);	
	}

	// Set button Cancel
	let buttonCancel = E("modal-cancel");
	
	if(undefined == callback2 || null == callback2) {
		buttonCancel.style.display = "none";
	}
	else {
		buttonCancel.style.display = "";
		newButton = buttonCancel.cloneNode(true); // For reset event listner
		buttonCancel.parentNode.replaceChild(newButton, buttonCancel);
		newButton.addEventListener("click", callback2, false);
	}

	// Set button Signin
	let buttonSignin = E("modal-signin");
	if("" == USER.token || null == USER.token) {
		buttonSignin.style.display = "";
		E("modal-close").style.display = "none";
	}
	else {
		buttonSignin.style.display = "none";
		E("modal-close").style.display = "";
	}
}

function closeModal() {

	let modal = E("modal");
	modal.style.display = "none";
}