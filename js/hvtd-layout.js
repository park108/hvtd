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
