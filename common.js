let GLOBAL_SETTING = {
	"log": true,
	"language": "KO",
	"auto_copy": true,
	"auto_collapse": true,
}

let GLOBAL_VARIABLE = {
	"node_id": 0,
	"changed": false,
	"selected_date": null
}

function log(line) {
	if(GLOBAL_SETTING.log) {
		console.log(line);
	}
}

function getMessage(code, param1, param2, param3) {

	if("001" == code) {
		if("KO" == GLOBAL_SETTING.language) return "하위 항목까지 모두 삭제 하시겠습니까?";
		else if("EN" == GLOBAL_SETTING.language) return "It has children. Do you delete it?";
		else return "It has children. Do you delete it?";
	}
	else if("002" == code) {
		if("KO" == GLOBAL_SETTING.language) return "이전 데이터를 복사하시겠습니까? (" + param1 + ")";
		else if("EN" == GLOBAL_SETTING.language) return "Do you copy last todo?(" + param1 + ")";
		else return "Do you copy last todo?(" + param1 + ")";
	}
	else if("003" == code) {
		if("KO" == GLOBAL_SETTING.language) return "";
		else if("EN" == GLOBAL_SETTING.language) return "";
		else return "";	
	}
	else if("004" == code) {
		if("KO" == GLOBAL_SETTING.language) return "초기화 하시겠습니까?";
		else if("EN" == GLOBAL_SETTING.language) return "Do you clear data?";
		else return "Do you clear data?";	
	}
}

function getWeekText(week) {
	if(0 == week) {
		if("KO" == GLOBAL_SETTING.language) return "일";
		else if("EN" == GLOBAL_SETTING.language) return "SUN";
		else return "SUN";
	}
	else if(1 == week) {
		if("KO" == GLOBAL_SETTING.language) return "월";
		else if("EN" == GLOBAL_SETTING.language) return "MON";
		else return "SUN";
	}
	else if(2 == week) {
		if("KO" == GLOBAL_SETTING.language) return "화";
		else if("EN" == GLOBAL_SETTING.language) return "TUE";
		else return "TUE";
	}
	else if(3 == week) {
		if("KO" == GLOBAL_SETTING.language) return "수";
		else if("EN" == GLOBAL_SETTING.language) return "WED";
		else return "WED";
	}
	else if(4 == week) {
		if("KO" == GLOBAL_SETTING.language) return "목";
		else if("EN" == GLOBAL_SETTING.language) return "THU";
		else return "THU";
	}
	else if(5 == week) {
		if("KO" == GLOBAL_SETTING.language) return "금";
		else if("EN" == GLOBAL_SETTING.language) return "FRI";
		else return "FRI";
	}
	else if(6 == week) {
		if("KO" == GLOBAL_SETTING.language) return "토";
		else if("EN" == GLOBAL_SETTING.language) return "SAT";
		else return "SAT";
	}
}

function getChanged() {
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
