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
	"open_modal": false,
}

let USER = {
	"id": "",
	"name": "",
	"token": "",
	"image": "",
	"id_provider": ""
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
	"settings": null
	, "constants": null
	, "todo": null
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

function percentEncode(str) {

	if(null == str || "" == str) {
		return "";
	}
	else {

		var result= encodeURIComponent(str);
		
		// Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
		return result.replace(/\!/g, "%21")
			.replace(/\'/g, "%27")
			.replace(/\(/g, "%28")
			.replace(/\)/g, "%29")
			.replace(/\*/g, "%2A");
	}
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

function setForEachFunction() {
	
	if(window.XMLHttpRequest) {
		NodeList.prototype.forEach = Array.prototype.forEach;
	}
}

function isInt(data) {

	if (data === parseInt(data, 10)) {
		return true;
	}
	else {
		return false;
	}
}

function isMobile() {

	let check = false;

	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

	return check;
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

// Set modal open flag
function setModalOpen(isOpened) {
	GLOBAL_VARIABLE.open_modal = isOpened;
}

// Set data change flag
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

	// Set modal open flag
	setModalOpen(true);

	// Create confirm modal
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

		// Remove modal open flag
		setModalOpen(false);
	}
}
