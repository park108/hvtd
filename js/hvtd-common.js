let SETTINGS = {
	"log": false,
	"language": "EN",
	"auto_collapse": false,
	"show_calendar": false,
	"copy_complete_child": false,
	"auto_save_interval": 0,
	"show_toolbar": true,
	"tooltip": true,
}

let GLOBAL_VARIABLE = {
	"node_id": 0,
	"changed": false,
	"selected_date": null,
	"max_position": 0,
	"auto_save_timer": null,
	"now_loading": false,
	"touch_sensitivity": 100,
	"touch_x": null,
	"touch_y": null,
	"resize_timer": null,
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
		"GATEWAY_URL": "https://g72s9v6ioa.execute-api.ap-northeast-2.amazonaws.com"
		, "STAGE_NAME": "test"
		, "API_NAME": "settings"
	},
	"TODO": {
		"GATEWAY_URL": "https://tfsds3iaxe.execute-api.ap-northeast-2.amazonaws.com"
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

		let timestamp = new Date();

		console.log("[" + timestamp + "] " + caller + ": " + line);
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

	let gateway = api.GATEWAY_URL;
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

function setInnerHtml(id, text) {

	let item = E(id);

	if(undefined != item) {
		item.innerHTML = text;
	}
}

function setDomAttribute(id, attr, value) {

	let item = E(id);

	if(undefined != item) {
		item.setAttribute(attr, value);
	}
}

function removeDomAttribute(id, attr) {

	let item = E(id);

	if(undefined != item) {
		item.removeAttribute(attr);
	}
}

// Data has changed
function isChanged() {
	return GLOBAL_VARIABLE.changed;	
}

// Set is data changed
function setChanged(isChanged) {

	GLOBAL_VARIABLE.changed = false;

	// Check semaphore
	if(!GLOBAL_VARIABLE.now_loading && isChanged) {
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

// Open confirm modal
function openConfirmModal(message, callback1, callback2) {

	// Create modal display
	let confirm = document.createElement("div");
	confirm.setAttribute("id", "confirm");
	confirm.classList.add("modal");
	confirm.style.display = "block";
	document.body.appendChild(confirm);

	// Create content
	let content = document.createElement("div");
	content.classList.add("modal-content");
	confirm.appendChild(content);

	// Create close button
	let closeButton = document.createElement("span");
	closeButton.setAttribute("id", "confirm-close");
	closeButton.classList.add("close");
	closeButton.addEventListener("click", closeConfirmModal, false);
	closeButton.innerHTML = "&times;";
	content.appendChild(closeButton);

	// Create message paragraph
	let messageParagraph = document.createElement("p");
	messageParagraph.innerHTML = message;
	content.appendChild(messageParagraph);

	// Create button set
	let buttonSet = document.createElement("div");
	buttonSet.classList.add("button-set");
	content.appendChild(buttonSet);

	// Create buttons
	let hasButtonOk = false;
	let hasButtonCancel = false;

	// Set button OK
	if(undefined != callback1 && null != callback1) {
		let buttonOk = document.createElement("button");
		buttonOk.setAttribute("id", "modal-button-ok");
		buttonOk.classList.add("button-ok");
		buttonOk.addEventListener("click", callback1, false);
		buttonOk.innerHTML = getKeyword("OK");
		buttonSet.appendChild(buttonOk);

		hasButtonOk = true;
	}

	// Set button Cancel
	if(undefined != callback2 || null != callback2) {
		let buttonCancel = document.createElement("button");
		buttonCancel.setAttribute("id", "modal-button-cancel");
		buttonCancel.classList.add("button-cancel");
		buttonCancel.addEventListener("click", callback2, false);
		buttonCancel.innerHTML = getKeyword("CANCEL");
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
}

// Close confirm modal
function closeConfirmModal() {

	let confirm = E("confirm");

	if(undefined != confirm) {
		document.body.removeChild(confirm);
	}
}
