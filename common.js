var GLOBAL_SETTING = {
	"log": true,
	"language": "KO",
	"auto_collapse": true
}

var GLOBAL_VARIABLE = {
	"node_id": 0,
	"changed": false
}

function log(line) {
	if(GLOBAL_SETTING.log) {
		console.log(line);
	}
}

function addClass(e, className) {

	classes = e.getAttribute("class");
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
}