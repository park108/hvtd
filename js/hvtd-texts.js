let TEXTS = {
	"TOOLTIP": {
		"000": {
			"KO": "Alt C : 달력 접기/펴기",
			"EN": "Alt C : Fold/Unfold Calendar",
		},
		"001": {
			"KO": "삭제",
			"EN": "Clear",
		},
		"002": {
			"KO": "Alt S : 저장",
			"EN": "Alt S : Save",
		},
		"003": {
			"KO": "Alt 1 : 모두 펼치기",
			"EN": "Alt 1 : Expand All",
		},
		"004": {
			"KO": "Alt 2 : 모두 접기",
			"EN": "Alt 2 : Collapse All",
		},
		"005": {
			"KO": "사용자 정보",
			"EN": "User Information",
		},
		"006": {
			"KO": "Alt T : 오늘로 이동",
			"EN": "Alt T : Go today",
		},
		"007": {
			"KO": "이전 미완료건 복사",
			"EN": "Copy Previous Incomplete",
		},
	},
	"MESSAGE": {
		"000": {
			"KO": "hvtd에 로그인 하세요.",
			"EN": "Sign in to hvtd.",
		},
		"001": {
			"KO": "하위 항목까지 모두 삭제 하시겠습니까?",
			"EN": "It has children. Do you delete it?",
		},
		"002": {
			"KO": "이전 일자를 복사하시겠습니까?",
			"EN": "Do you copy last todo?",
		},
		"003": {
			"KO": "",
			"EN": "",
		},
		"004": {
			"KO": "데이터를 지우시겠습니까?",
			"EN": "Do you clear data?",
		},
		"005": {
			"KO": "변경된 내용이 있습니다. 정말 나가시겠습니까?",
			"EN": "Changes exist. Are you sure?",
		},
	},
	"WEEK_TEXT": {
		0: {"KO": "일", "EN": "SUN"},
		1: {"KO": "월", "EN": "MON"},
		2: {"KO": "화", "EN": "TUE"},
		3: {"KO": "수", "EN": "WED"},
		4: {"KO": "목", "EN": "THU"},
		5: {"KO": "금", "EN": "FRI"},
		6: {"KO": "토", "EN": "SAT"},
	},
	"KEYWORD": {
		"USER_DROPDOWN_SIGNOUT": {
			"KO": "로그아웃",
			"EN": "Sign Out",
		},
		"USER_DROPDOWN_SETTINGS": {
			"KO": "설정",
			"EN": "Settings",
		},
		"SETTINGS_LANGUAGE": {
			"KO": "언어",
			"EN": "Language",
		},
		"SETTINGS_COLLAPSE": {
			"KO": "자동 접기",
			"EN": "Auto collapse",
		},
		"SETTINGS_SHOWCALENDAR": {
			"KO": "달력 보이기",
			"EN": "Show calendar",
		},
		"SETTINGS_AUTOSAVE": {
			"KO": "자동 저장 간격",
			"EN": "Auto save interval",
		},
		"SETTINGS_AUTOSAVE_UNIT": {
			"KO": "분",
			"EN": "min.",
		},
		"SETTINGS_TOOLTIP": {
			"KO": "도움말 출력",
			"EN": "Show tooltip",
		},
		"LANGUAGE_KO": {
			"KO": "한글",
			"EN": "Korean",
		},
		"LANGUAGE_EN": {
			"KO": "영어",
			"EN": "English",
		},
		"OK": {
			"KO": "확인",
			"EN": "OK",
		},
		"CANCEL": {
			"KO": "취소",
			"EN": "Cancel",
		},
		"FOLD_UNFOLD_CALENDAR": {
			"KO": "달력 접기/펴기",
			"EN": "Fold/Unfold Calendar",
		},
		"CLEAR": {
			"KO": "삭제",
			"EN": "Clear",
		},
		"SAVE": {
			"KO": "저장",
			"EN": "Save",
		},
		"EXPAND_ALL": {
			"KO": "모두 펼치기",
			"EN": "Expand All",
		},
		"COLLAPSE_ALL": {
			"KO": "모두 접기",
			"EN": "Collapse All",
		},
		"COPY_PREVIOUS": {
			"KO": "이전 미완료건 복사",
			"EN": "Copy Previous Incomplete",
		},
	},
}

// Get tooltip
function getTooltip(code) {

	return TEXTS.TOOLTIP[code][SETTINGS.language];
}

// Set tooltip text
function setTooltipText() {

	let component;

	if(SETTINGS.tooltip) {
		setDomAttribute("navigation-toolbar-today", "data-tooltip", getTooltip("006"));
		setDomAttribute("navigation-toolbar-copy", "data-tooltip", getTooltip("007"));
		setDomAttribute("navigation-toolbar-calendar", "data-tooltip", getTooltip("000"));
		setDomAttribute("navigation-toolbar-clear", "data-tooltip", getTooltip("001"));
		setDomAttribute("navigation-toolbar-save", "data-tooltip", getTooltip("002"));
		setDomAttribute("navigation-toolbar-expandall", "data-tooltip", getTooltip("003"));
		setDomAttribute("navigation-toolbar-collapseall", "data-tooltip", getTooltip("004"));
		setDomAttribute("user-icon", "data-tooltip", getTooltip("005"));
	}
	else {
		removeDomAttribute("navigation-toolbar-today", "data-tooltip");
		removeDomAttribute("navigation-toolbar-copy", "data-tooltip");
		removeDomAttribute("navigation-toolbar-calendar", "data-tooltip");
		removeDomAttribute("navigation-toolbar-clear", "data-tooltip");
		removeDomAttribute("navigation-toolbar-save", "data-tooltip");
		removeDomAttribute("navigation-toolbar-expandall", "data-tooltip");
		removeDomAttribute("navigation-toolbar-collapseall", "data-tooltip");
		removeDomAttribute("user-icon", "data-tooltip");
	}
}

// Get week text
function getWeekText(week) {

	return TEXTS.WEEK_TEXT[week][SETTINGS.language];
}

// Get message
function getMessage(code, param1, param2, param3) {

	// Get default string
	let message = TEXTS.MESSAGE[code][SETTINGS.language];

	// Replace placeholder to parameter
	if(undefined != param1) { message = message.replace("{1}", param1); }
	else { message = message.replace("{1}", ""); }

	if(undefined != param2) { message = message.replace("{2}", param2); }
	else { message = message.replace("{2}", ""); }

	if(undefined != param3) { message = message.replace("{3}", param3); }
	else { message = message.replace("{3}", ""); }

	return message;
}

// Get keyword
function getKeyword(code, param1, param2, param3) {

	// Get default keyword
	let message = TEXTS.KEYWORD[code][SETTINGS.language];

	// Replace placeholder to parameter
	if(undefined != param1) { message = message.replace("{1}", param1); }
	else { message = message.replace("{1}", ""); }

	if(undefined != param2) { message = message.replace("{2}", param2); }
	else { message = message.replace("{2}", ""); }

	if(undefined != param3) { message = message.replace("{3}", param3); }
	else { message = message.replace("{3}", ""); }

	return message;
}
