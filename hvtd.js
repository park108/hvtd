var ICON_COLLAPSE = "<img src='./icons/minus.svg' />"
var ICON_EXPAND = "<img src='./icons/plus.svg' />"
var ICON_DONE = "<img src='./icons/check.svg' />"
var ICON_DONE_NO = "<img src='./icons/check_false.svg' />"
var ICON_CANCEL = "<img src='./icons/cross.svg' />"
var ICON_CANCEL_NO = "<img src='./icons/cross_false.svg' />"

function newNodeId() {
	++GLOBAL_VARIABLE.node_id;
}

function changeData(e) {
	log("CHANGE_DATA: ID = " + e.target.parentNode.id);
	GLOBAL_VARIABLE.changed = true;
}

function createNode(currentNode) {

	if(undefined == currentNode) {
		currentNode = document.getElementById("header-of-node");
	}
	else {
		GLOBAL_VARIABLE.changed = true;
	}

	var level = getNodeLevel(currentNode);
	if(undefined == level || 0 == level) {
		level = 1;
	}

	// Node Frame
	newNodeId();
	var newNode = document.createElement("div");
	newNode.setAttribute("id", GLOBAL_VARIABLE.node_id);
	newNode.setAttribute("level", level);
	newNode.setAttribute("status", "N");
	newNode.setAttribute("class", "node-frame");
	newNode.setAttribute("onkeydown", "return keyin(event)");

	// Node Contents
	var newNodeContents = document.createElement("div");
	newNodeContents.setAttribute("id", "contents" + GLOBAL_VARIABLE.node_id);
	newNodeContents.setAttribute("class", "node-contents");
	newNodeContents.setAttribute("contenteditable", "true");
	newNodeContents.setAttribute("onpaste", "return stripTags(this)");
	newNodeContents.setAttribute("ondrop", "return false");

	// Node Toolbar
	var newNodeToolbar = document.createElement("div");
	newNodeToolbar.setAttribute("class", "node-toolbar");

	// Node Toolbar Elements
	var newLabelCollapse = document.createElement("label");
	newLabelCollapse.setAttribute("for", "collapse" + GLOBAL_VARIABLE.node_id);
	newLabelCollapse.setAttribute("class", "node-toolbar-label");
	newLabelCollapse.innerHTML = ICON_COLLAPSE;
	var newCheckboxCollpase = document.createElement("input");
	newCheckboxCollpase.setAttribute("id", "collapse" + GLOBAL_VARIABLE.node_id);
	newCheckboxCollpase.setAttribute("type", "checkbox");
	newCheckboxCollpase.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxCollpase.setAttribute("onclick", "return executeToobarCommand(this)");
	var newLabelDone = document.createElement("label");
	newLabelDone.setAttribute("for", "done" + GLOBAL_VARIABLE.node_id);
	newLabelDone.setAttribute("class", "node-toolbar-label");
	newLabelDone.innerHTML = ICON_DONE_NO;
	var newCheckboxDone = document.createElement("input");
	newCheckboxDone.setAttribute("id", "done" + GLOBAL_VARIABLE.node_id);
	newCheckboxDone.setAttribute("type", "checkbox");
	newCheckboxDone.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxDone.setAttribute("onclick", "return executeToobarCommand(this)");
	var newLabelCancel = document.createElement("label");
	newLabelCancel.setAttribute("for", "cancel" + GLOBAL_VARIABLE.node_id);
	newLabelCancel.setAttribute("class", "node-toolbar-label");
	newLabelCancel.innerHTML = ICON_CANCEL_NO;
	var newCheckboxCancel = document.createElement("input");
	newCheckboxCancel.setAttribute("id", "cancel" + GLOBAL_VARIABLE.node_id);
	newCheckboxCancel.setAttribute("type", "checkbox");
	newCheckboxCancel.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxCancel.setAttribute("onclick", "return executeToobarCommand(this)");

	// Combine into newNode
	newNodeToolbar.appendChild(newLabelCollapse);
	newNodeToolbar.appendChild(newCheckboxCollpase);
	newNodeToolbar.appendChild(newLabelDone);
	newNodeToolbar.appendChild(newCheckboxDone);
	newNodeToolbar.appendChild(newLabelCancel);
	newNodeToolbar.appendChild(newCheckboxCancel);
	newNode.appendChild(newNodeContents);
	newNode.appendChild(newNodeToolbar);

	// TODO: currentNode 가 collapsed 인 경우, 마지막 child의 다음에 신규 node를 생성
	if("header-of-node" != currentNode.id
		&& document.getElementById("collapse" + currentNode.id).checked
		&& hasChildNode(currentNode)) {

		var childrenIdList = getChildrenIdList(currentNode);
		var lastChild = childrenIdList.pop();
		currentNode.parentNode.insertBefore(newNode, document.getElementById(lastChild).nextSibling);
	}
	else {
		currentNode.parentNode.insertBefore(newNode, currentNode.nextSibling);
	}

	log("CREATE: Current = " + currentNode.id + ", New = " + newNode.id);

	newNodeContents.addEventListener("input", changeData, false);
	refreshNode(newNode);

	newNodeContents.focus();
}

function deleteNode(node, key) {

	var nodeCount = getNodeCount();

	// If it has last node, do not delete.
	if(2 > nodeCount) {

		return false;
	}

	var doDelete = true;
	var childrenIdList;
	var childrenCount = 0;

	// If has children, get user confirm
	if(hasChildNode(node)) {
		
		childrenIdList = getChildrenIdList(node);
		childrenCount = childrenIdList.length;

		// If it is last parent node, do not delete.
		if((nodeCount - 1) == childrenCount) {
			return false;
		}

		doDelete = confirm(getMessage("001"));
	}

	if(doDelete) {

		// Delete all children
		if(0 < childrenCount) {
			childrenIdList.forEach(function(id) {
				childNode = document.getElementById(id);
				node.parentNode.removeChild(childNode);
			});
		}

		var setFocustOnLast = true;
		var focusingNode;

		// Delete by command or backspace key
		if(undefined == key || "BACKSPACE" == key) {

			// Set focus on previous visible node
			focusingNode = getPreviousVisibleNode(node);
			setFocustOnLast = true;

			// If didn't have focusing node, set focus on next sibling node
			if(node.id == focusingNode.id) {
				focusingNode = getNextSiblingNode(node);
				setFocustOnLast = false;
			}
		}

		// Delete by delete key
		else if("DELETE" == key) {

			// Set focus on next sibling node
			focusingNode = getNextSiblingNode(node);
			setFocustOnLast = false;

			// If didn't have focusing node, set focus on previous visible node
			if(undefined == focusingNode) {
				focusingNode = getPreviousVisibleNode(node);
				setFocustOnLast = true;
			}
		}

		// Set caret position
		setFocustOnLast ? setCaretPositionToLast(focusingNode) : setCaretPositionToFirst(focusingNode);

		// Delete this node
		node.parentNode.removeChild(node);

		log("DELETE_NODE: ID = " + node.id);
	}
}

function setCaretPositionToFirst(node) {
	
	var contents = getContents(node);
	contents.focus();
}

function setCaretPositionToLast(node) {
	
	var contents = getContents(node);
	contents.focus();

	var lastChild = contents.childNodes[contents.childNodes.length - 1];

	if(undefined != lastChild) {

		var range = document.createRange();
		range.setStart(lastChild, lastChild.length);
		range.collapse(true);

		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

function getNodeLevel(node) {

	var level = node.getAttribute("level");

	if(undefined == level) {
		return undefined;
	}
	else {
		return level * 1;
	}
}

function getNodeCount() {

	// Count based on class name "node-contents"
	return document.getElementsByClassName("node-contents").length;
}

function getNodeList() {

	var list = [];

	var currentNode = document.getElementById("header-of-node").nextSibling;

	while(undefined != currentNode) {
		list.push(currentNode);
		currentNode = getNextNode(currentNode);
	}

	return list;
}

function hasChildNode(node) {

	var nextNode = getNextNode(node);

	if(undefined == nextNode) {
		return false;
	}

	var currentNodeLevel = getNodeLevel(node);
	var nextNodeLevel = getNodeLevel(nextNode);

	if(currentNodeLevel < nextNodeLevel) {
		return true;
	}
	else {
		return false;
	}
}

function getChildrenIdList(node) {

	var baseNodeLevel = getNodeLevel(node);
	var nextNode = getNextNode(node);
	var childrenIdList = [];

	while(undefined != nextNode) {
		
		var nextNodeLevel = getNodeLevel(nextNode);

		if(baseNodeLevel < nextNodeLevel) {
			childrenIdList.push(nextNode.id);
		}
		else {
			break;
		}

		nextNode = getNextNode(nextNode);
	}

	return childrenIdList;
}

function getParentIdList(node) {

	var baseNodeLevel = getNodeLevel(node);
	var prevNode = getPreviousNode(node);
	var minimumLevel = baseNodeLevel;
	var prevNodeLevel = 0;
	var parentIdList = [];

	while(undefined != prevNode) {
		
		prevNodeLevel = getNodeLevel(prevNode);

		if(prevNodeLevel < minimumLevel) {
			parentIdList.push(prevNode.id);
			minimumLevel = prevNodeLevel;
		}

		prevNode = getPreviousNode(prevNode);
	}

	return parentIdList;
}

function setStatus(node, status) {

	// N: None
	// D: Done
	// C: Cancel
	node.setAttribute("status", status);
	GLOBAL_VARIABLE.changed = true;
}

function getParentStatus(node) {

	var parentIdList = getParentIdList(node);
	var returnStatus = [];

	returnStatus.push(node.getAttribute("status")); // Current Status

	var parentNode;

	parentIdList.forEach(function(id) {
		parentNode = document.getElementById(id);
		returnStatus.push(parentNode.getAttribute("status"));
	});

	return returnStatus;
}

function hideNode(node) {

	var parentIdList = getParentIdList(node);
	var isCollapsed = false;

	// If one or more parents is collapsed
	parentIdList.forEach(function(id) {
		if(document.getElementById("collapse" + id).checked) {
			isCollapsed = true;
		}
	});

	// This Node is hidden
	node.style.display = isCollapsed ? "none" : "block";
}

function setBackgroundByNodeStatus(node) {

	var statusArray = getParentStatus(node);
	var status = "N";
	statusArray.forEach(function(st) {
		if(null == st) {
			return false;
		}
		
		if("N" == st) {
			return false;
		}
		else {
			status = st;
			return true;
		}
	});

	if("N" == status) {
		addClass(node, "node-status-none");
		removeClass(node, "node-status-done");
		removeClass(node, "node-status-cancel");
	}
	else if("D" == status) {
		removeClass(node, "node-status-none");
		addClass(node, "node-status-done");
		removeClass(node, "node-status-cancel");
	}
	else if("C" == status) {
		removeClass(node, "node-status-none");
		removeClass(node, "node-status-done");
		addClass(node, "node-status-cancel");
	}
}

function setCollapseButtonVisibility(node) {

	var collapse = document.getElementById("collapse" + node.id).previousSibling;
	var isVisible = hasChildNode(node);

	collapse.style.visibility = isVisible ? "visible" : "hidden";
}

function refreshNode(node) {
	
	var childrenIdList = getChildrenIdList(node);
	var parentsIdList = getParentIdList(node);

	// Refresh
	setLeftMarginByNodeLevel(node);
	setBackgroundByNodeStatus(node);
	setCollapseButtonVisibility(node);
	hideNode(node);

	// Refresh children
	var childNode;

	childrenIdList.forEach(function(id) {
		childNode = document.getElementById(id);
		setLeftMarginByNodeLevel(childNode);
		setBackgroundByNodeStatus(childNode);
		setCollapseButtonVisibility(childNode);
		hideNode(childNode);
	});

	// Refresh parents
	var parentNode;

	parentsIdList.forEach(function(id) {
		parentNode = document.getElementById(id);
		setLeftMarginByNodeLevel(parentNode);
		setBackgroundByNodeStatus(parentNode);
		setCollapseButtonVisibility(parentNode);
	});

	// Refresh previous
	var prevNode = getPreviousNode(node);

	if(undefined != prevNode) {
		setLeftMarginByNodeLevel(prevNode);
		setBackgroundByNodeStatus(prevNode);
		setCollapseButtonVisibility(prevNode);
	}
}

function getPreviousNode(node) {

	var prevNode = node.previousSibling;

	if(undefined == prevNode) {
		return undefined;
	}
	else if(undefined == prevNode.id) {
		return undefined;
	}
	else if(undefined == prevNode.getAttribute("status")) {
		return undefined;
	}
	else {
		return prevNode;
	}
}

function getNextNode(node) {

	var nextNode = node.nextSibling;

	if(undefined == nextNode) {
		return undefined;
	}
	else if(undefined == nextNode.id) {
		return undefined;
	}
	else if(undefined == nextNode.getAttribute("status")) {
		return undefined;
	}
	else {
		return nextNode;
	}
}

function isNodeVisible(node) {

	return "block" == node.style.display;
}

function isNodeFirst(node) {
	return undefined == getPreviousNode(node);
}

function isNodeLast(node) {
	return undefined == getNextNode(node);
}

function getPreviousVisibleNode(node) {

	var prevNode = node;
	var lastVisibleNode = node;

	while(!isNodeFirst(prevNode)) {

		prevNode = getPreviousNode(prevNode);

		if(isNodeVisible(prevNode)) {
			lastVisibleNode = prevNode;
			break;
		}
	}

	return lastVisibleNode;
}

function getNextVisibleNode(node) {

	var nextNode = node;
	var lastVisibleNode = node;

	while(!isNodeLast(nextNode)) {

		nextNode = getNextNode(nextNode);

		if(isNodeVisible(nextNode)) {
			lastVisibleNode = nextNode;
			break;
		}
	}

	return lastVisibleNode;
}

function getNextSiblingNode(node) {

	var baseNode = node;
	var baseNodeLevel = getNodeLevel(baseNode);

	var nextNode = node;
	var nextNodeLevel;
	var nextSiblingNode = undefined;

	while(true) {

		nextNode = getNextNode(nextNode);
		nextNodeLevel = getNodeLevel(nextNode);

		if(baseNodeLevel >= nextNodeLevel) {
			nextSiblingNode = nextNode;
			break;
		}

		if(isNodeLast(nextNode)) {
			break;
		}
	}

	return nextSiblingNode;
}

function increaseLevel(node) {

	// Get children before increase
	var childrenIdList = getChildrenIdList(node);

	// Increase current Node level
	var currentNodeLevel = getNodeLevel(node);
	node.setAttribute("level", currentNodeLevel + 1);

	// Increase children level
	var childNodeLevel = 0;

	childrenIdList.forEach(function(id) {
		childNode = document.getElementById(id);
		childNodeLevel = getNodeLevel(childNode);
		childNode.setAttribute("level", childNodeLevel + 1);
	});

	refreshNode(node);

	log("INCREASE_LEVEL: ID = " + node.id + ", LEVEL = " + (currentNodeLevel + 1));
	GLOBAL_VARIABLE.changed = true;
}

function decreaseLevel(node) {

	// Get children before decrease
	var childrenIdList = getChildrenIdList(node);

	// Decrease current Node level
	var currentNodeLevel = getNodeLevel(node);
	if(currentNodeLevel == 1) return false;
	node.setAttribute("level", currentNodeLevel - 1);

	// Decrease children level
	var childNodeLevel = 0;

	childrenIdList.forEach(function(id) {
		childNode = document.getElementById(id);
		childNodeLevel = childNode.getAttribute("level") * 1;
		childNode.setAttribute("level", childNodeLevel - 1);
	});

	refreshNode(node);

	log("DECREASE_LEVEL: ID = " + node.id + ", LEVEL = " + (currentNodeLevel - 1));
	GLOBAL_VARIABLE.changed = true;
}

function setLeftMarginByNodeLevel(node) {
	var level = getNodeLevel(node);
	node.style.margin = "3px 0px 5px " + (20 * (level - 1)) + "px";
	node.style.width = "calc(100% - " + (20 * (level - 1)) + "px)"
}

function getContents(node) {
	return document.getElementById("contents" + node.id);
}

function movePreviousNode(node, onLast) {

	var prevNode = getPreviousVisibleNode(node);

	if(node.id != prevNode.id) {

		if(undefined == onLast || false == onLast) {
			setCaretPositionToFirst(prevNode);
		}
		else {
			setCaretPositionToLast(prevNode);
		}

		log("MOVE_PREV: " + node.id + " -> " + prevNode.id);
	}
}

function moveNextNode(node, onLast) {

	var nextNode = getNextVisibleNode(node);

	if(node.id != nextNode.id) {

		if(undefined == onLast || false == onLast) {
			setCaretPositionToFirst(nextNode);
		}
		else {
			setCaretPositionToLast(nextNode);
		}

		log("MOVE_NEXT: " + node.id + " -> " + nextNode.id);
	}
}

function newTodo() {
	log("NEW TODO");
}

function saveTodo() {
	
	var nodeList = getNodeList();
	var todoList = [];
	var nodeObject;
	nodeList.forEach(function(node) {

		nodeObject = new Object();
		nodeObject.id = node.id;
		nodeObject.level = node.getAttribute("level");
		nodeObject.status = node.getAttribute("status");
		nodeObject.collapse = document.getElementById("collapse" + node.id).checked;
		nodeObject.contents = document.getElementById("contents" + node.id).innerHTML;
		
		todoList.push(nodeObject);
	});

	var jsonString = JSON.stringify(todoList);

	log("SAVE: " + jsonString);

	GLOBAL_VARIABLE.changed = false;
}

function openTodo() {
	log("OPEN TODO");
}

function getCaretOffset() {

	var selection = window.getSelection();

	if(selection.getRangeAt) {
		return selection.getRangeAt(0).endOffset;
	}
	else {
		return -1;
	}
}

function stripTags(contents) {

	setTimeout(function() {
		unwrap(contents, "span");
		unwrap(contents, "br");
	}, 0);
}

// Unwrap tags
function unwrap(root, tagname, extra) {

	var elms = root.getElementsByTagName(tagname);
	var l = elms.length;

	for(var i = l - 1; i >= 0; i--) {
		
		// work backwards to avoid possible complications with nested spans
		while(elms[i].firstChild)
			elms[i].parentNode.insertBefore(elms[i].firstChild,elms[i]);

		if(extra) extra(elms[i]);

		elms[i].parentNode.removeChild(elms[i]);
	}
}

function executeToobarCommand(e) {

	var id = e.id;

	// Is it checked
	var checked = document.getElementById(id).checked;

	// Get node data
	var node = e.parentNode.parentNode; // Toolbar -> Node

	if(id.indexOf("collapse") > -1) {
		executeCollapse(e, node);
	}
	else if(id.indexOf("done") > -1) {
		executeDone(e, node);
	}
	else if(id.indexOf("cancel") > -1) {
		executeCancel(e, node);
	}
}

function executeCollapse(checkbox, node) {

	if(hasChildNode(node)) {

		var checked = checkbox.checked;

		// Set icon
		checkbox.previousSibling.innerHTML = checked ? ICON_EXPAND : ICON_COLLAPSE;

		// Set collapse line
		checked ? addClass(node, "node-frame-collapsed") : removeClass(node, "node-frame-collapsed");

		refreshNode(node);

		log((checked ? "COLLAPSE" : "EXPAND") + "_NODE: ID = " + node.id);
		GLOBAL_VARIABLE.changed = true;
	}
}

function executeDone(checkbox, node) {
	
	// Disable cancel
	var cancelCheckbox = document.getElementById("cancel" + node.id);
	cancelCheckbox.checked = false;
	var cancelLabel = cancelCheckbox.previousSibling;
	cancelLabel.innerHTML = ICON_CANCEL_NO;

	// Set icon
	var checked = checkbox.checked;
	checkbox.previousSibling.innerHTML = checked ? ICON_DONE : ICON_DONE_NO;
	setStatus(node, checked ? "D" : "N");

	refreshNode(node);

	// If auto collapse enabled, collapse/expand this Node
	if(GLOBAL_SETTING.auto_collapse && hasChildNode(node)) {
		var collapseCheckbox = document.getElementById("collapse" + node.id);
		collapseCheckbox.checked = checked;
		executeCollapse(collapseCheckbox, node);
	}

	log((checked ? "DONE" : "UNDONE") + "_NODE: ID = " + node.id);
	GLOBAL_VARIABLE.changed = true;
}

function executeCancel(checkbox, node) {
	
	// Disable done
	var doneCheckbox = document.getElementById("done" + node.id);
	doneCheckbox.checked = false;
	var doneLabel = doneCheckbox.previousSibling;
	doneLabel.innerHTML = ICON_DONE_NO;

	// Set icon
	var checked = checkbox.checked;
	checkbox.previousSibling.innerHTML = checked ? ICON_CANCEL : ICON_CANCEL_NO;
	setStatus(node, checked ? "C" : "N");

	refreshNode(node);

	// If auto collapse enabled, collapse/expand this Node
	if(GLOBAL_SETTING.auto_collapse && hasChildNode(node)) {
		var collapseCheckbox = document.getElementById("collapse" + node.id);
		collapseCheckbox.checked = checked;
		executeCollapse(collapseCheckbox, node);
	}

	log((checked ? "CANCEL" : "UNCANCEL") + "_NODE: ID = " + node.id);
	GLOBAL_VARIABLE.changed = true;
}

function keyin(e) {

	var currentNode = window.getSelection().focusNode.parentNode;

	if(-1 < currentNode.id.indexOf("contents")) {
		currentNode = currentNode.parentNode;
	}

	// log("KEY_IN: ID = " + currentNode.id + ", KEYCODE = " + e.which);
	
	// Enter
	if(13 == e.which) {

		createNode(currentNode);
		return false;
	}

	// Tab
	else if(9 == e.which) {

		if(e.shiftKey) {
			decreaseLevel(currentNode);
		}
		else {
			increaseLevel(currentNode);
		}
		return false;
	}

	// Backspace
	else if(8 == e.which) {

		if(0 == getCaretOffset() && 0 == getContents(currentNode).innerHTML.length) {
			deleteNode(currentNode, "BACKSPACE");
			return false;
		}
	}

	// Delete
	else if(46 == e.which) {

		if(0 == getCaretOffset() && 0 == getContents(currentNode).innerHTML.length) {
			deleteNode(currentNode, "DELETE");
			return false;
		}
	}

	// Left arrow
	else if(37 == e.which) {

		// When caret is first position of Node
		if(0 == getCaretOffset()) {

			if(hasChildNode(currentNode)) {

				var collapse = document.getElementById("collapse" + currentNode.id);

				if(!collapse.checked) {
					collapse.checked = true;
					executeToobarCommand(collapse);
					return false;
				}
				else {
					movePreviousNode(currentNode, true);
					return false;
				}
			}
			else {
				movePreviousNode(currentNode, true);
				return false;
			}
		}
	}

	// Right arrow
	else if(39 == e.which) {

		var children = getContents(currentNode).childNodes;
		var cnt = children.length;
		var lastString = (0 == cnt) ? "" : children[cnt - 1];

		// When caret is last position of Node
		if(lastString.length == getCaretOffset()) {

			if(hasChildNode(currentNode)) {

				var collapse = document.getElementById("collapse" + currentNode.id);

				if(collapse.checked) {
					collapse.checked = false;
					executeToobarCommand(collapse);
					return false;
				}
				else {
					moveNextNode(currentNode);
					return false;
				}
			}
			else {
				moveNextNode(currentNode);
				return false;
			}
		}
	}

	// Up arrow
	else if(38 == e.which) {
		movePreviousNode(currentNode);
		return false;
	}

	// Down arrow
	else if(40 == e.which) {
		moveNextNode(currentNode);
		return false;
	}

	// Ctrl + N: New
	else if(e.ctrlKey && 78 == e.which) {
		newTodo();
		return false;
	}

	// Ctrl + S: Save
	else if(e.ctrlKey && 83 == e.which) {
		saveTodo();
		return false;
	}

	// Ctrl + O: Open
	else if(e.ctrlKey && 79 == e.which) {
		openTodo();
		return false;
	}
}

window.onload = function() {
	createNode();
}

window.onbeforeunload = function(e) {

	if(GLOBAL_VARIABLE.changed) {
		var msg = getMessage("002");
		e.returnValue = msg;
	}

	return msg;
};