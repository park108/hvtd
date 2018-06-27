let SETTINGS = {
	"log": false,
	"language": "EN",
	"auto_copy": false,
	"auto_collapse": false,
	"tooltip": true,
}

let GLOBAL_VARIABLE = {
	"node_id": 0,
	"changed": false,
	"selected_date": null,
	"max_position": 0,
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

let API = {
	"SETTINGS": {
		"API_GATEWAY_URL": "https://g72s9v6ioa.execute-api.ap-northeast-2.amazonaws.com"
		, "STAGE_NAME": "test"
		, "API_NAME": "settings"
	},
	"TODO": {
		"API_GATEWAY_URL": "https://tfsds3iaxe.execute-api.ap-northeast-2.amazonaws.com"
		, "STAGE_NAME": "test"
		, "API_NAME": "todo"
	}
}

function log(line) {

	if(SETTINGS.log) {

		let caller = arguments.callee.caller.toString();
		caller = caller.substr(0, caller.indexOf('\n'));
		caller = caller.substr(0, caller.indexOf('{'));

		if(undefined == line) {
			line = "";
		}

		console.log(caller + ": " + line);
	}
}

function E(id) {
	return document.getElementById(id);
}

function getXMLHttpRequestObject() {

	let req;

	if(window.XMLHttpRequest) {
		req = new XMLHttpRequest();
	}
	else if(window.ActiveXObject) { // Above IE 8
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}

	return req;
}

// Get API URL
function getApiUrl(api, additionalInfo) {

	let gateway = api.API_GATEWAY_URL;
	let stageName = api.STAGE_NAME;
	let apiName = api.API_NAME;

	return gateway + "/" + stageName + "/" + apiName + "/" + additionalInfo;
}

// Call API
function callAPI(apiUrl, method, data) {

	log(method + " -> " + apiUrl);

	return new Promise(function(resolve, reject) {

		// Prepare request
		let req = getXMLHttpRequestObject();

		req.open(method, apiUrl);
		req.setRequestHeader("Content-type", "application/json");

		req.onload = function() {

			if(req.status == 200) {
				resolve(req.response);
			}
			else {
				reject(Error(req.statusText));
			}
		};

		req.onerror = function() {
			reject(Error("Network Error"));
		}

		// Send request
		if("GET" == method) {
			req.send();
		}
		else {
			req.send(data);	
		}
	});
}

// Set tooltip text
function setTooltipText() {

	let component;

	if(SETTINGS.tooltip) {

		component = E("navigation-toolbar-calendar");
		if(undefined != component) component.setAttribute("data-tooltip", getTooltip("000"));

		component = E("navigation-toolbar-clear");
		if(undefined != component) component.setAttribute("data-tooltip", getTooltip("001"));

		component = E("navigation-toolbar-save");
		if(undefined != component) component.setAttribute("data-tooltip", getTooltip("002"));

		component = E("navigation-toolbar-expandall");
		if(undefined != component) component.setAttribute("data-tooltip", getTooltip("003"));

		component = E("navigation-toolbar-collapseall");
		if(undefined != component) component.setAttribute("data-tooltip", getTooltip("004"));
	}
	else {

		component = E("navigation-toolbar-calendar");
		if(undefined != component) component.removeAttribute("data-tooltip");

		component = E("navigation-toolbar-clear");
		if(undefined != component) component.removeAttribute("data-tooltip");

		component = E("navigation-toolbar-save");
		if(undefined != component) component.removeAttribute("data-tooltip");

		component = E("navigation-toolbar-expandall");
		if(undefined != component) component.removeAttribute("data-tooltip");

		component = E("navigation-toolbar-collapseall");
		if(undefined != component) component.removeAttribute("data-tooltip");
	}
}

// Get tooltip
function getTooltip(code) {

	if("000" == code) {
		if("KO" == SETTINGS.language) return "Alt C : 달력 접기/펴기";
		else if("EN" == SETTINGS.language) return "Alt C : Fold/Unfold Calendar";
		else return "Alt C : Fold/Unfold Calendar";
	}
	else if("001" == code) {
		if("KO" == SETTINGS.language) return "삭제";
		else if("EN" == SETTINGS.language) return "Delete";
		else return "Delete";
	}
	else if("002" == code) {
		if("KO" == SETTINGS.language) return "Alt S : 저장";
		else if("EN" == SETTINGS.language) return "Alt S : Save";
		else return "Alt S : Save";
	}
	else if("003" == code) {
		if("KO" == SETTINGS.language) return "Alt 1 : 모두 펼치기";
		else if("EN" == SETTINGS.language) return "Alt 1 : Expand All";
		else return "Alt 1 : Expand All";
	}
	else if("004" == code) {
		if("KO" == SETTINGS.language) return "Alt 2 : 모두 접기";
		else if("EN" == SETTINGS.language) return "Alt 2 : Collapse All";
		else return "Alt 2 : Collapse All";
	}
}

// Get message
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
	else if("005" == code) {
		if("KO" == SETTINGS.language) return "변경된 내용이 있습니다. 정말 나가시겠습니까?";
		else if("EN" == SETTINGS.language) return "Changes exist. Are you sure?";
		else return "Changes exist. Are you sure?";	
	}
}

// Get text
function getText(code, param1, param2, param3) {

	if("USER_DROPDOWN_SIGNOUT" == code) {
		if("KO" == SETTINGS.language) return "로그아웃";
		else if("EN" == SETTINGS.language) return "Sign Out";
		else return "Sign Out";	
	}
	else if("USER_DROPDOWN_SETTINGS" == code) {
		if("KO" == SETTINGS.language) return "설정";
		else if("EN" == SETTINGS.language) return "Settings";
		else return "Settings";	
	}
	else if("SETTINGS_LANGUAGE" == code) {
		if("KO" == SETTINGS.language) return "언어";
		else if("EN" == SETTINGS.language) return "Language";
		else return "Language";	
	}
	else if("SETTINGS_COLLAPSE" == code) {
		if("KO" == SETTINGS.language) return "자동 접기";
		else if("EN" == SETTINGS.language) return "Auto collapse";
		else return "Auto collapse";	
	}
	else if("SETTINGS_TOOLTIP" == code) {
		if("KO" == SETTINGS.language) return "도움말 출력";
		else if("EN" == SETTINGS.language) return "Show tooltip";
		else return "Show Tooltip";	
	}
	else if("LANGUAGE_KO" == code) {
		if("KO" == SETTINGS.language) return "한글";
		else if("EN" == SETTINGS.language) return "Korean";
		else return "Korean";	
	}
	else if("LANGUAGE_EN" == code) {
		if("KO" == SETTINGS.language) return "영어";
		else if("EN" == SETTINGS.language) return "English";
		else return "English";	
	}
	else if("OK" == code) {
		if("KO" == SETTINGS.language) return "확인";
		else if("EN" == SETTINGS.language) return "OK";
		else return "OK";	
	}
	else if("CANCEL" == code) {
		if("KO" == SETTINGS.language) return "취소";
		else if("EN" == SETTINGS.language) return "Cancel";
		else return "Cancel";
	}
	else if("EXPAND_ALL" == code) {
		if("KO" == SETTINGS.language) return "모두 펼치기";
		else if("EN" == SETTINGS.language) return "Expand All";
		else return "Expand All";
	}
	else if("COLLAPSE_ALL" == code) {
		if("KO" == SETTINGS.language) return "모두 접기";
		else if("EN" == SETTINGS.language) return "Collapse All";
		else return "Collapse All";
	}
}

// Get week text
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

// Data has changed
function isChanged() {
	return GLOBAL_VARIABLE.changed;	
}

// Set is data changed
function setChanged(isChanged) {

	if(GLOBAL_VARIABLE.changed != isChanged) {
		GLOBAL_VARIABLE.changed = isChanged;
	}
}

// Get caret position
function getCaretPosition() {

	let selection = window.getSelection();

	if(selection.getRangeAt) {
		return selection.getRangeAt(0).endOffset;
	}
	else {
		return -1;
	}
}

// Set caret position
function setCaretPosition(e, pos) {

	log("ID = " + e.id + ", POS = " + pos);

    if(e != null) {

    	let range = document.createRange();
    	let sel = window.getSelection();
		range.setStart(e.childNodes[0], pos);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
    }
}

// Get selected date YYYYMMDD format
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

// Open modal popup
function openModal(message, callback1, callback2) {

	// Set modal display
	let modal = E("modal");
	modal.style.display = "block";

	// Set message
	let messageDom = E("modal-message");
	messageDom.innerHTML = message;

	// Get modal-button-set
	let buttonSet = E("modal-button-set");
	let hasButtonOk = false;
	let hasButtonCancel = false;

	// Set button OK
	if(undefined != callback1 && null != callback1) {
		let buttonOk = document.createElement("button");
		buttonOk.setAttribute("id", "modal-button-ok");
		buttonOk.classList.add("button-ok");
		buttonOk.addEventListener("click", callback1, false);
		buttonOk.innerHTML = getText("OK");
		buttonSet.appendChild(buttonOk);

		hasButtonOk = true;
	}

	// Set button Cancel
	if(undefined != callback2 || null != callback2) {
		let buttonCancel = document.createElement("button");
		buttonCancel.setAttribute("id", "modal-button-cancel");
		buttonCancel.classList.add("button-cancel");
		buttonCancel.addEventListener("click", callback2, false);
		buttonCancel.innerHTML = getText("CANCEL");
		buttonSet.appendChild(buttonCancel);

		hasButtonCancel = true;
	}

	// Set class
	if(hasButtonOk && hasButtonCancel) {
		E("modal-button-ok").classList.add("button-set-twin");
		E("modal-button-cancel").classList.add("button-set-twin");
	}
	else if(hasButtonOk && !hasButtonCancel) {
		E("modal-button-ok").classList.add("button-set-single");
	}
	else if(!hasButtonOk && hasButtonCancel) {
		E("modal-button-cancel").classList.add("button-set-single");
	}

	// Set button Signin
	let buttonSignin = E("modal-button-signin");
	let buttonClose = E("modal-close");

	if("" == USER.token || null == USER.token) {
		buttonSignin.style.display = "";
		buttonClose.style.display = "none";
	}
	else {
		buttonSignin.style.display = "none";
		buttonClose.style.display = "";
	}
}

// Close modal popup
function closeModal() {

	let modal = E("modal");
	modal.style.display = "none";

	let buttonSet = E("modal-button-set");
	let buttonOk = E("modal-button-ok");
	let buttonCancel = E("modal-button-cancel");

	if(undefined != buttonOk) {
		buttonSet.removeChild(buttonOk);
	}
	if(undefined != buttonCancel) {
		buttonSet.removeChild(buttonCancel);	
	}
}
