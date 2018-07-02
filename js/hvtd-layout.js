function afterResize() {

	setToolbarButtonLayout();
	setContentsMargin();
}

function setContentsMargin() {

	let header = E("header");
	let contents = E("contents");

	contents.style.marginTop = (header.clientHeight + 5) + "px";
}

function setNodeFrameMargin(node) {

	let level = getNodeLevel(node);
	let sideMargin = 5;
	let marginTop = (1 == level) ? 8 : 0;
	let marginLeft = (20 * (level - 1))

	node.style.marginTop = marginTop + "px";
	node.style.marginLeft = (marginLeft + sideMargin) + "px" ;
	node.style.marginBottom = "0px";
	node.style.marginRight = sideMargin + "px";

	let space = marginLeft + (sideMargin * 2);
	node.style.width = "calc(100% - " + space + "px)";
}

function setSemaphore(set, message) {

	GLOBAL_VARIABLE.now_loading = set;
	E("processing-message").innerHTML = "";

	if(GLOBAL_VARIABLE.now_loading) {
		E("processing-message").innerHTML = message;
		E("processing").style.display = "block";
	}
	else {
		E("processing").style.display = "none";	
	}
}

function setBottomMessage(type, message) {

	// Show bottom message bar
	let bottomMessage = E("bottom-message");
	bottomMessage.innerHTML = "‣ " + message;
	bottomMessage.classList.add(type);
	bottomMessage.classList.add("show");

	// Hide 2 seconds after
	setTimeout(function() {
		bottomMessage.classList.remove("show");
		bottomMessage.classList.remove(type);
	}, 2000);
}