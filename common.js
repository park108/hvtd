var GLOBAL_SETTING = {
	"log": true,
	"language": "KO",
	"auto_collapse": true
}

var GLOBAL_VARIABLE = {
	"node_id": 0,
	"changed": false,
	"selected_date": null
}

function log(line) {
	if(GLOBAL_SETTING.log) {
		console.log(line);
	}
}

function addClass(e, className) {

	classes = e.getAttribute("class");
	if(null == classes) {
		classes = "";
	}
	if(classes.indexOf(className) == -1) {
		e.setAttribute("class", classes + " " + className);
	}
}

function removeClass(e, className) {
	classes = e.getAttribute("class");
	e.setAttribute("class", classes.replace(" " + className, ""));
}

function getMessage(code) {

	if("001" == code) {
		if("KO" == GLOBAL_SETTING.language) return "하위 항목까지 모두 삭제 하시겠습니까?";
		else if("EN" == GLOBAL_SETTING.language) return "It has children. Do you delete it?";
		else return "It has children. Do you delete it?";
	}
	else if("002" == code) {
		if("KO" == GLOBAL_SETTING.language) return "수정사항을 저장하지 않고 종료하시겠습니까?";
		else if("EN" == GLOBAL_SETTING.language) return "Do you leave this page before save changed data?";
		else return "Do you leave this page before save changed data?";	
	}
	else if("W00" == code) {
		if("KO" == GLOBAL_SETTING.language) return "일";
		else if("EN" == GLOBAL_SETTING.language) return "SUN";
		else return "SUN";
	}
	else if("W01" == code) {
		if("KO" == GLOBAL_SETTING.language) return "일";
		else if("EN" == GLOBAL_SETTING.language) return "SUN";
		else return "SUN";
	}
	else if("W02" == code) {
		if("KO" == GLOBAL_SETTING.language) return "화";
		else if("EN" == GLOBAL_SETTING.language) return "TUE";
		else return "TUE";
	}
	else if("W03" == code) {
		if("KO" == GLOBAL_SETTING.language) return "수";
		else if("EN" == GLOBAL_SETTING.language) return "WED";
		else return "WED";
	}
	else if("W04" == code) {
		if("KO" == GLOBAL_SETTING.language) return "목";
		else if("EN" == GLOBAL_SETTING.language) return "THU";
		else return "THU";
	}
	else if("W05" == code) {
		if("KO" == GLOBAL_SETTING.language) return "금";
		else if("EN" == GLOBAL_SETTING.language) return "FRI";
		else return "FRI";
	}
	else if("W06" == code) {
		if("KO" == GLOBAL_SETTING.language) return "토";
		else if("EN" == GLOBAL_SETTING.language) return "SAT";
		else return "SAT";
	}
}