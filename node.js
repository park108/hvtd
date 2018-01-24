let ICON_COLLAPSE = "<img src='./icons/minus.svg' />"
let ICON_EXPAND = "<img src='./icons/plus.svg' />"
let ICON_DONE = "<img src='./icons/check.svg' />"
let ICON_DONE_NO = "<img src='./icons/check_false.svg' />"
let ICON_CANCEL = "<img src='./icons/cross.svg' />"
let ICON_CANCEL_NO = "<img src='./icons/cross_false.svg' />"

function changeData(e) {
	log("CHANGE_DATA: ID = " + e.target.parentNode.id);
	setChanged(true);
}

function createNode(currentNode, inputLevel, inputStatus, inputCollapse, inputContents) {

	// Set previous node
	if(undefined == currentNode) {
		currentNode = document.getElementById("header-of-node");
	}
	else if(undefined == inputLevel) {
		setChanged(true);
	}

	// Set level
	let level = 1;
	if(undefined != inputLevel) {
		level = inputLevel;
	}
	else {
		level = getNodeLevel(currentNode);		
	}

	if(undefined == level || 0 == level) {
		level = 1;
	}

	// Set status
	let status = "N";
	if(undefined != inputStatus) {
		status = inputStatus;
	}

	// Set collapse
	let collapse = false;
	if(undefined != inputCollapse) {
		collapse = inputCollapse;
	}

	// Set contents
	let contents = "";
	if(undefined != inputContents) {
		contents = inputContents;
	}

	// Increase node id 
	++GLOBAL_VARIABLE.node_id;

	// Node Frame
	let newNode = document.createElement("div");
	newNode.setAttribute("id", GLOBAL_VARIABLE.node_id);
	newNode.setAttribute("level", level);
	newNode.setAttribute("status", status);
	newNode.setAttribute("class", "node-frame");
	// newNode.addEventListener("keydown", keyInContents, false);
	newNode.setAttribute("onkeydown", "return keyInContents(event)");

	// Node Contents
	let newNodeContents = document.createElement("div");
	newNodeContents.setAttribute("id", "contents" + GLOBAL_VARIABLE.node_id);
	newNodeContents.setAttribute("class", "node-contents");
	newNodeContents.setAttribute("contenteditable", "true");
	newNodeContents.setAttribute("onpaste", "return setPastedContents(this)");
	newNodeContents.setAttribute("ondrop", "return false");
	newNodeContents.innerHTML = contents;

	// Node Toolbar
	let newNodeToolbar = document.createElement("div");
	newNodeToolbar.setAttribute("class", "node-toolbar");

	// Node Toolbar Elements
	let newLabelCollapse = document.createElement("label");
	newLabelCollapse.setAttribute("for", "collapse" + GLOBAL_VARIABLE.node_id);
	newLabelCollapse.setAttribute("class", "node-toolbar-label");
	newLabelCollapse.innerHTML = collapse ? ICON_EXPAND : ICON_COLLAPSE;
	let newCheckboxCollpase = document.createElement("input");
	newCheckboxCollpase.setAttribute("id", "collapse" + GLOBAL_VARIABLE.node_id);
	newCheckboxCollpase.setAttribute("type", "checkbox");
	newCheckboxCollpase.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxCollpase.setAttribute("onclick", "return executeToobarCommand(this)");
	newCheckboxCollpase.checked = collapse;
	let newLabelDone = document.createElement("label");
	newLabelDone.setAttribute("for", "done" + GLOBAL_VARIABLE.node_id);
	newLabelDone.setAttribute("class", "node-toolbar-label");
	newLabelDone.innerHTML = ("D" == status) ? ICON_DONE : ICON_DONE_NO;
	let newCheckboxDone = document.createElement("input");
	newCheckboxDone.setAttribute("id", "done" + GLOBAL_VARIABLE.node_id);
	newCheckboxDone.setAttribute("type", "checkbox");
	newCheckboxDone.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxDone.setAttribute("onclick", "return executeToobarCommand(this)");
	newCheckboxDone.checked = ("D" == status);
	let newLabelCancel = document.createElement("label");
	newLabelCancel.setAttribute("for", "cancel" + GLOBAL_VARIABLE.node_id);
	newLabelCancel.setAttribute("class", "node-toolbar-label");
	newLabelCancel.innerHTML = ("C" == status) ? ICON_CANCEL : ICON_CANCEL_NO;
	let newCheckboxCancel = document.createElement("input");
	newCheckboxCancel.setAttribute("id", "cancel" + GLOBAL_VARIABLE.node_id);
	newCheckboxCancel.setAttribute("type", "checkbox");
	newCheckboxCancel.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxCancel.setAttribute("onclick", "return executeToobarCommand(this)");
	newCheckboxCancel.checked = ("C" == status);

	// Combine into newNode
	newNodeToolbar.appendChild(newLabelCollapse);
	newNodeToolbar.appendChild(newCheckboxCollpase);
	newNodeToolbar.appendChild(newLabelDone);
	newNodeToolbar.appendChild(newCheckboxDone);
	newNodeToolbar.appendChild(newLabelCancel);
	newNodeToolbar.appendChild(newCheckboxCancel);
	newNode.appendChild(newNodeContents);
	newNode.appendChild(newNodeToolbar);

	// CurrentNode 가 collapsed 인 경우, 마지막 child의 다음에 신규 node를 생성
	if("header-of-node" != currentNode.id
		&& document.getElementById("collapse" + currentNode.id).checked
		&& hasChildNode(currentNode)) {

		let childrenIdList = getChildrenIdList(currentNode);
		let lastChild = childrenIdList.pop();
		currentNode.parentNode.insertBefore(newNode, document.getElementById(lastChild).nextSibling);
	}
	else {
		currentNode.parentNode.insertBefore(newNode, currentNode.nextSibling);
	}

	log("CREATE: Current = " + currentNode.id + ", New = " + newNode.id);

	newNodeContents.addEventListener("input", changeData, false);
	refreshNode(newNode);

	newNodeContents.focus();

	return newNode;
}

function deleteNode(node, forceDelete, key) {

	let nodeCount = getNodeCount();

	// If it has last node, do not delete.
	if(2 > nodeCount) {

		return false;
	}

	let doDelete = true;
	let childrenIdList;
	let childrenCount = 0;

	// If has children and not force delete, get user confirm
	if(hasChildNode(node)) {
		
		childrenIdList = getChildrenIdList(node);
		childrenCount = childrenIdList.length;

		// If it is last parent node, do not delete.
		if((nodeCount - 1) == childrenCount) {
			return false;
		}

		if(!forceDelete) {
			doDelete = confirm(getMessage("001"));
		}
	}

	if(doDelete) {

		// Delete all children
		if(0 < childrenCount) {
			childrenIdList.forEach(function(id) {
				childNode = document.getElementById(id);
				node.parentNode.removeChild(childNode);
			});
		}

		let setFocusOnLast = true;
		let focusingNode;

		// Delete by command or backspace key
		if(undefined == key || "BACKSPACE" == key) {

			// Set focus on previous visible node
			focusingNode = getPreviousVisibleNode(node);
			setFocusOnLast = true;

			// If didn't have focusing node, set focus on next sibling node
			if(node.id == focusingNode.id) {
				focusingNode = getNextSiblingNode(node);
				setFocusOnLast = false;
			}
		}

		// Delete by delete key
		else if("DELETE" == key) {

			// Set focus on next sibling node
			focusingNode = getNextSiblingNode(node);
			setFocusOnLast = false;

			// If didn't have focusing node, set focus on previous visible node
			if(undefined == focusingNode) {
				focusingNode = getPreviousVisibleNode(node);
				setFocusOnLast = true;
			}
		}

		// Set caret position
		setFocusOnLast ? setCaretPositionToLast(focusingNode) : setCaretPositionToFirst(focusingNode);

		// Delete this node
		node.parentNode.removeChild(node);

		log("DELETE_NODE: ID = " + node.id);
	}
}

function setCaretPositionToFirst(node) {
	
	let contents = getContents(node);
	contents.focus();
}

function setCaretPositionToLast(node) {
	
	let contents = getContents(node);
	contents.focus();

	let lastChild = contents.childNodes[contents.childNodes.length - 1];

	if(undefined != lastChild) {

		let range = document.createRange();
		range.setStart(lastChild, lastChild.length);
		range.collapse(true);

		let sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

function getNodeLevel(node) {

	if(undefined == node) {
		return undefined;
	}

	let level = node.getAttribute("level");

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

	let list = [];

	let currentNode = document.getElementById("header-of-node").nextSibling;

	while(undefined != currentNode) {
		list.push(currentNode);
		currentNode = getNextNode(currentNode);
	}

	return list;
}

function hasChildNode(node) {

	let nextNode = getNextNode(node);

	if(undefined == nextNode) {
		return false;
	}

	let currentNodeLevel = getNodeLevel(node);
	let nextNodeLevel = getNodeLevel(nextNode);

	if(currentNodeLevel < nextNodeLevel) {
		return true;
	}
	else {
		return false;
	}
}

function getChildrenIdList(node) {

	let baseNodeLevel = getNodeLevel(node);
	let nextNode = getNextNode(node);
	let childrenIdList = [];

	while(undefined != nextNode) {
		
		let nextNodeLevel = getNodeLevel(nextNode);

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

	let baseNodeLevel = getNodeLevel(node);
	let prevNode = getPreviousNode(node);
	let minimumLevel = baseNodeLevel;
	let prevNodeLevel = 0;
	let parentIdList = [];

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

function setNodeStatus(node, status) {

	// N: None
	// D: Done
	// C: Cancel
	node.setAttribute("status", status);
	setChanged(true);
}

function getParentStatusList(node) {

	let parentIdList = getParentIdList(node);
	let returnStatus = [];

	returnStatus.push(node.getAttribute("status")); // Current Status

	let parentNode;

	parentIdList.forEach(function(id) {
		parentNode = document.getElementById(id);
		returnStatus.push(parentNode.getAttribute("status"));
	});

	return returnStatus;
}

function setNodeVisibility(node) {

	let parentIdList = getParentIdList(node);
	let isCollapsed = false;

	// If one or more parents is collapsed
	parentIdList.forEach(function(id) {
		if(document.getElementById("collapse" + id).checked) {
			isCollapsed = true;
		}
	});

	// This Node is hidden
	node.style.display = isCollapsed ? "none" : "block";
}

function isNodeVisible(node) {

	return "block" == node.style.display;
}

function setBackgroundByNodeStatus(node) {

	let statusArray = getParentStatusList(node);
	let status = "N";
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
		node.classList.add("node-status-none");
		node.classList.remove("node-status-done");
		node.classList.remove("node-status-cancel");
	}
	else if("D" == status) {
		node.classList.remove("node-status-none");
		node.classList.add("node-status-done");
		node.classList.remove("node-status-cancel");
	}
	else if("C" == status) {
		node.classList.remove("node-status-none");
		node.classList.remove("node-status-done");
		node.classList.add("node-status-cancel");
	}
}

function setCollapseButtonVisibility(node) {

	let collapse = document.getElementById("collapse" + node.id).previousSibling;
	let isVisible = hasChildNode(node);

	collapse.style.visibility = isVisible ? "visible" : "hidden";
}

function refreshNode(node) {
	
	let childrenIdList = getChildrenIdList(node);
	let parentsIdList = getParentIdList(node);

	// Refresh
	setLeftMarginByNodeLevel(node);
	setBackgroundByNodeStatus(node);
	setCollapseButtonVisibility(node);
	setNodeVisibility(node);

	// Refresh children
	let childNode;

	childrenIdList.forEach(function(id) {
		childNode = document.getElementById(id);
		setLeftMarginByNodeLevel(childNode);
		setBackgroundByNodeStatus(childNode);
		setCollapseButtonVisibility(childNode);
		setNodeVisibility(childNode);
	});

	// Refresh parents
	let parentNode;

	parentsIdList.forEach(function(id) {
		parentNode = document.getElementById(id);
		setLeftMarginByNodeLevel(parentNode);
		setBackgroundByNodeStatus(parentNode);
		setCollapseButtonVisibility(parentNode);
	});

	// Refresh previous
	let prevNode = getPreviousNode(node);

	if(undefined != prevNode) {
		setLeftMarginByNodeLevel(prevNode);
		setBackgroundByNodeStatus(prevNode);
		setCollapseButtonVisibility(prevNode);
	}
}

function isNodeFirst(node) {
	return undefined == getPreviousNode(node);
}

function isNodeLast(node) {
	return undefined == getNextNode(node);
}

function getPreviousNode(node) {

	let prevNode = node.previousSibling;

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

	let nextNode = node.nextSibling;

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

function getPreviousVisibleNode(node) {

	let prevNode = node;
	let lastVisibleNode = node;

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

	let nextNode = node;
	let lastVisibleNode = node;

	while(!isNodeLast(nextNode)) {

		nextNode = getNextNode(nextNode);

		if(isNodeVisible(nextNode)) {
			lastVisibleNode = nextNode;
			break;
		}
	}

	return lastVisibleNode;
}

function getPreviousSiblingNode(node) {

	let baseNode = node;
	let baseNodeLevel = getNodeLevel(baseNode);

	let prevNode = node;
	let prevNodeLevel;
	let prevSiblingNode = undefined;

	while(true) {

		prevNode = getPreviousNode(prevNode);

		if(undefined == prevNode) {
			break;
		}

		prevNodeLevel = getNodeLevel(prevNode);

		if(baseNodeLevel == prevNodeLevel) {
			prevSiblingNode = prevNode;
			break;
		}
		else if(baseNodeLevel < prevNodeLevel) {
			break;
		}
	}

	return prevSiblingNode;
}

function getNextSiblingNode(node) {

	let baseNode = node;
	let baseNodeLevel = getNodeLevel(baseNode);

	let nextNode = node;
	let nextNodeLevel;
	let nextSiblingNode = undefined;

	while(true) {

		nextNode = getNextNode(nextNode);

		if(undefined == nextNode) {
			break;
		}
		
		nextNodeLevel = getNodeLevel(nextNode);

		if(baseNodeLevel == nextNodeLevel) {
			nextSiblingNode = nextNode;
			break;
		}
		else if(baseNodeLevel > nextNodeLevel) {
			break;
		}
	}

	return nextSiblingNode;
}

function increaseNodeLevel(node) {

	// Get children before increase
	let childrenIdList = getChildrenIdList(node);

	// Increase current Node level
	let currentNodeLevel = getNodeLevel(node);
	node.setAttribute("level", currentNodeLevel + 1);

	// Increase children level
	let childNodeLevel = 0;

	childrenIdList.forEach(function(id) {
		childNode = document.getElementById(id);
		childNodeLevel = getNodeLevel(childNode);
		childNode.setAttribute("level", childNodeLevel + 1);
	});

	refreshNode(node);

	log("INCREASE_LEVEL: ID = " + node.id + ", LEVEL = " + (currentNodeLevel + 1));
	setChanged(true);
}

function decreaseNodeLevel(node) {

	// Get children before decrease
	let childrenIdList = getChildrenIdList(node);

	// Decrease current Node level
	let currentNodeLevel = getNodeLevel(node);
	if(currentNodeLevel == 1) return false;
	node.setAttribute("level", currentNodeLevel - 1);

	// Decrease children level
	let childNodeLevel = 0;

	childrenIdList.forEach(function(id) {
		childNode = document.getElementById(id);
		childNodeLevel = childNode.getAttribute("level") * 1;
		childNode.setAttribute("level", childNodeLevel - 1);
	});

	refreshNode(node);

	log("DECREASE_LEVEL: ID = " + node.id + ", LEVEL = " + (currentNodeLevel - 1));
	setChanged(true);
}

function setLeftMarginByNodeLevel(node) {
	let level = getNodeLevel(node);
	node.style.margin = "3px 0px 5px " + (20 * (level - 1)) + "px";
	node.style.width = "calc(100% - " + (20 * (level - 1)) + "px)"
}

function getContents(node) {
	return document.getElementById("contents" + node.id);
}

function movePreviousNode(node, doCaretSetLast) {

	let prevNode = getPreviousVisibleNode(node);

	if(node.id != prevNode.id) {

		if(undefined == doCaretSetLast || false == doCaretSetLast) {
			setCaretPositionToFirst(prevNode);
		}
		else {
			setCaretPositionToLast(prevNode);
		}

		log("MOVE_PREV: " + node.id + " -> " + prevNode.id);
	}
}

function moveNextNode(node, doCaretSetLast) {

	let nextNode = getNextVisibleNode(node);

	if(node.id != nextNode.id) {

		if(undefined == doCaretSetLast || false == doCaretSetLast) {
			setCaretPositionToFirst(nextNode);
		}
		else {
			setCaretPositionToLast(nextNode);
		}

		log("MOVE_NEXT: " + node.id + " -> " + nextNode.id);
	}
}

function moveNodeToPrevious(node) {

	if(isNodeFirst(node)) {
		return false;
	}

	let thisNodeLevel = getNodeLevel(node);
	let prevNode = getPreviousNode(node);
	let baseNode = undefined;

	// Get base node
	while(true) {

		if(undefined == prevNode) {
			break;
		}

		if(thisNodeLevel == getNodeLevel(prevNode)) {

			baseNode = getPreviousNode(prevNode);
			break;
		}
		else if(thisNodeLevel > getNodeLevel(prevNode)) {

			baseNode = prevNode;
			break;
		}
		else {

			prevNode = getPreviousNode(prevNode);
		}
	}

	// Copy this node below base node
	let copiedCurrentNode = createNode(baseNode
								, getNodeLevel(node)
								, node.status
								, false
								, getContents(node).innerHTML);

	// Copy this node's children
	let childrenIdList = getChildrenIdList(node);
	let childNode;
	baseNode = copiedCurrentNode;

	childrenIdList.forEach(function(id) {
		childNode = document.getElementById(id);
		baseNode = createNode(baseNode
					, getNodeLevel(childNode)
					, childNode.status
					, false
					, getContents(childNode).innerHTML);
	});

	// Force delete current node & children
	deleteNode(node, true);

	// Set focus copied node
	setCaretPositionToFirst(copiedCurrentNode);
}

function moveNodeToNext(node) {

	let nextSiblingNode = getNextSiblingNode(node);

	if(undefined == nextSiblingNode) {
		return false;
	}

	// Get base node
	let baseNode;
	let nextSiblingChildrenIdList = getChildrenIdList(nextSiblingNode);

	if(nextSiblingChildrenIdList.length > 0) {
		let baseNodeId = nextSiblingChildrenIdList.pop();
		baseNode = document.getElementById(baseNodeId);
	}
	else {
		baseNode = nextSiblingNode;
	}
	
	log("BASE_NODE = " + baseNode.id);

	// Copy this node below base node
	let copiedCurrentNode = createNode(baseNode
								, getNodeLevel(node)
								, node.status
								, false
								, getContents(node).innerHTML);

	// Copy this node's children
	let childrenIdList = getChildrenIdList(node);
	let childNode;
	baseNode = copiedCurrentNode;

	childrenIdList.forEach(function(id) {
		childNode = document.getElementById(id);
		baseNode = createNode(baseNode
					, getNodeLevel(childNode)
					, childNode.status
					, false
					, getContents(childNode).innerHTML);
	});

	// Force delete current node & children
	deleteNode(node, true);

	// Set focus copied node
	setCaretPositionToFirst(copiedCurrentNode);
}

function executeToobarCommand(e) {

	let id = e.id;

	// Is it checked
	let checked = document.getElementById(id).checked;

	// Get node data
	let node = e.parentNode.parentNode; // Toolbar -> Node

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

		let checked = checkbox.checked;

		// Set icon
		checkbox.previousSibling.innerHTML = checked ? ICON_EXPAND : ICON_COLLAPSE;

		// Set collapse line
		checked ? node.classList.add("node-frame-collapsed") : node.classList.remove("node-frame-collapsed");

		refreshNode(node);

		// Set cursor
		checked ? setCaretPositionToFirst(node) : setCaretPositionToLast(node);

		log((checked ? "COLLAPSE" : "EXPAND") + "_NODE: ID = " + node.id);

		setChanged(true);
	}
}

function executeDone(checkbox, node) {
	
	// Disable cancel
	let cancelCheckbox = document.getElementById("cancel" + node.id);
	cancelCheckbox.checked = false;
	let cancelLabel = cancelCheckbox.previousSibling;
	cancelLabel.innerHTML = ICON_CANCEL_NO;

	// Set icon
	let checked = checkbox.checked;
	checkbox.previousSibling.innerHTML = checked ? ICON_DONE : ICON_DONE_NO;
	setNodeStatus(node, checked ? "D" : "N");

	refreshNode(node);

	// If auto collapse enabled, collapse/expand this Node
	if(GLOBAL_SETTING.auto_collapse && hasChildNode(node)) {
		let collapseCheckbox = document.getElementById("collapse" + node.id);
		collapseCheckbox.checked = checked;
		executeCollapse(collapseCheckbox, node);
	}

	// Set cursor
	setCaretPositionToLast(node);

	log((checked ? "DONE" : "UNDONE") + "_NODE: ID = " + node.id);
	setChanged(true);
}

function executeCancel(checkbox, node) {
	
	// Disable done
	let doneCheckbox = document.getElementById("done" + node.id);
	doneCheckbox.checked = false;
	let doneLabel = doneCheckbox.previousSibling;
	doneLabel.innerHTML = ICON_DONE_NO;

	// Set icon
	let checked = checkbox.checked;
	checkbox.previousSibling.innerHTML = checked ? ICON_CANCEL : ICON_CANCEL_NO;
	setNodeStatus(node, checked ? "C" : "N");

	refreshNode(node);

	// If auto collapse enabled, collapse/expand this Node
	if(GLOBAL_SETTING.auto_collapse && hasChildNode(node)) {
		let collapseCheckbox = document.getElementById("collapse" + node.id);
		collapseCheckbox.checked = checked;
		executeCollapse(collapseCheckbox, node);
	}

	// Set cursor
	setCaretPositionToLast(node);

	log((checked ? "CANCEL" : "UNCANCEL") + "_NODE: ID = " + node.id);

	setChanged(true);
}

function setPastedContents(contents) {

	setTimeout(function() {

		// Strip Tags
		let htmlBeforeStripTags = contents.innerHTML;
		let htmlAfterStripTags = htmlBeforeStripTags.replace(/<(?:.|\n)*?>/gm, '');

		// Split contents by new line character
		let splitContents = htmlAfterStripTags.split("\n");

		// Set variables
		let currentNode = contents.parentNode;
		let parentNodeLevel = getNodeLevel(currentNode);
		let currentContents = contents;
		let isFirst = true;
		let startTabCount = 0;
		let textNoTab;
		
		// Set splitted contents each node
		splitContents.forEach(function(text) {

			// Count first tabs
			startTabCount = 0;

			for(let i = 0; i < text.length; i++) {
				if('\t' == text.charAt(i)) {
					++startTabCount;
				}
				else {
					break;
				}
			}

			// Remove first tabs from text
			textNoTab = text.substring(startTabCount, text.length);

			// Paste text if it has length
			if(textNoTab.length > 0) {

				// First text line: paste on current node
				if(isFirst) {

					isFirst = false;

					// If has first tab, increse node level
					for(let i = 0; i < startTabCount; i++) {
						increaseNodeLevel(currentNode);
					}
				}

				// Not a first line, paste on new node
				else {

					// Create node with level
					currentNode = createNode(currentNode, parentNodeLevel + startTabCount);

					// Get contents object
					currentContents = getContents(currentNode);
				}

				// Set contents
				currentContents.innerHTML = textNoTab;
			}
		});

		setCaretPositionToLast(currentNode);

	}, 0);
}