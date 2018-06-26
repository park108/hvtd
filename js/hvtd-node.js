function changeData(e) {
	log(e.target.parentNode.id);
	setChanged(true);
	setSaveIconVisibillity();
}

function hasData() {

	if(1 == getNodeCount()) {

		let list = getNodeList();
		let node = list.pop();

		if("" == getContents(node).innerHTML) {

			return false;
		}
		else {

			return true;
		} 
	}
	else {

		return true;	
	}
}

function createNode(currentNode, inputLevel, inputStatus, inputCollapse, inputContents) {

	// Set previous node
	if(undefined == currentNode) {
		currentNode = E("header-of-node");
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
	newNodeContents.setAttribute("onpaste", "return removeTags(this)");
	newNodeContents.setAttribute("ondrop", "return false");
	newNodeContents.innerHTML = contents;

	// Node Toolbar
	let newNodeToolbar = document.createElement("div");
	newNodeToolbar.setAttribute("class", "node-toolbar");

	// Node Toolbar Elements
	let newLabelCollapse = document.createElement("label");
	newLabelCollapse.setAttribute("for", "collapse" + GLOBAL_VARIABLE.node_id);
	newLabelCollapse.setAttribute("class", "node-toolbar-label");
	newLabelCollapse.innerHTML = collapse ? IMG.icon_expand : IMG.icon_collapse;
	let newCheckboxCollpase = document.createElement("input");
	newCheckboxCollpase.setAttribute("id", "collapse" + GLOBAL_VARIABLE.node_id);
	newCheckboxCollpase.setAttribute("type", "checkbox");
	newCheckboxCollpase.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxCollpase.setAttribute("onclick", "return executeToolbarCommand(this)");
	newCheckboxCollpase.checked = collapse;
	let newLabelDone = document.createElement("label");
	newLabelDone.setAttribute("for", "done" + GLOBAL_VARIABLE.node_id);
	newLabelDone.setAttribute("class", "node-toolbar-label");
	newLabelDone.innerHTML = ("D" == status) ? IMG.icon_done : IMG.icon_done_no;
	let newCheckboxDone = document.createElement("input");
	newCheckboxDone.setAttribute("id", "done" + GLOBAL_VARIABLE.node_id);
	newCheckboxDone.setAttribute("type", "checkbox");
	newCheckboxDone.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxDone.setAttribute("onclick", "return executeToolbarCommand(this)");
	newCheckboxDone.checked = ("D" == status);
	let newLabelCancel = document.createElement("label");
	newLabelCancel.setAttribute("for", "cancel" + GLOBAL_VARIABLE.node_id);
	newLabelCancel.setAttribute("class", "node-toolbar-label");
	newLabelCancel.innerHTML = ("C" == status) ? IMG.icon_cancel : IMG.icon_cancel_no;
	let newCheckboxCancel = document.createElement("input");
	newCheckboxCancel.setAttribute("id", "cancel" + GLOBAL_VARIABLE.node_id);
	newCheckboxCancel.setAttribute("type", "checkbox");
	newCheckboxCancel.setAttribute("class", "node-toolbar-checkbox");
	newCheckboxCancel.setAttribute("onclick", "return executeToolbarCommand(this)");
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
		&& isNodeCollapsed(currentNode)
		&& hasChildNode(currentNode)) {

		let childrenIdList = getChildrenIdList(currentNode);
		let lastChild = childrenIdList.pop();
		currentNode.parentNode.insertBefore(newNode, E(lastChild).nextSibling);
	}
	else {
		currentNode.parentNode.insertBefore(newNode, currentNode.nextSibling);
	}

	log("Current = " + currentNode.id + ", New = " + newNode.id);

	newNodeContents.addEventListener("input", changeData, false);
	refreshNode(newNode);

	newNodeContents.focus();

	return newNode;
}

function isNodeCanDelete(node) {

	let nodeCount = getNodeCount();

	// If it is last node, cannot delete.
	if(2 > nodeCount) {

		return false;
	}

	// If it has no child node, can delete.
	if(!hasChildNode(node)) {

		return true;
	}

	// If it is last parent node, cannot delete.
	let childrenCount = getChildrenIdList(node).length;

	if((nodeCount - 1) == childrenCount) {
		return false;
	}

	return true;
}

function deleteNode(node, keycode) {

	let childrenIdList = getChildrenIdList(node);

	// Delete all children
	if(0 < childrenIdList.length) {
		childrenIdList.forEach(function(id) {
			childNode = E(id);
			node.parentNode.removeChild(childNode);
		});
	}

	let setFocusOnLast = true;
	let focusingNode;

	// Delete by command or backspace key
	if(undefined == keycode || 8 == keycode) {

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
	else if(46 == keycode) {

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

	log("ID = " + node.id);
}

function setCaretPositionToFirst(node) {
	
	if(undefined != node) {
		let contents = getContents(node);

		if(undefined != contents) {
			contents.focus();
		}
	}
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

function setNodeLevel(node, diff) {

	// If diff has no difference, end this function.
	if(undefined == diff || 0 == diff) {
		return false;
	}

	// Get current node level
	let currentNodeLevel = getNodeLevel(node);

	// Calc changing node level
	let changeNodeLevel = currentNodeLevel + diff;

	// If level is less than 1, end this function
	if(changeNodeLevel < 1) {
		return false;
	}

	// Get children before change level
	let childrenIdList = getChildrenIdList(node);

	// Set current Node level
	node.setAttribute("level", changeNodeLevel);

	// Set children level
	let childNodeLevel = 0;

	childrenIdList.forEach(function(id) {
		childNode = E(id);
		childNodeLevel = getNodeLevel(childNode);
		childNode.setAttribute("level", childNodeLevel + diff);
	});

	setChanged(true);

	log("ID = " + node.id + ", LEVEL = " + (currentNodeLevel + diff));
}

function getNodeStatus(node) {

	if(undefined == node) {
		return undefined;
	}

	// N: None
	// D: Done
	// C: Cancel
	let status = node.getAttribute("status");

	return status;
}

function setNodeStatus(node, status) {

	// N: None
	// D: Done
	// C: Cancel
	node.setAttribute("status", status);
	setChanged(true);

	log("ID = " + node.id + ", STATUS = " + status);
}

function getNodeCount() {

	// Count based on class name "node-contents"
	return document.getElementsByClassName("node-contents").length;
}

function getNodeList() {

	let list = [];

	let currentNode = E("header-of-node").nextSibling;

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

function getParentStatusList(node) {

	let parentIdList = getParentIdList(node);
	let returnStatus = [];

	returnStatus.push(node.getAttribute("status")); // Current Status

	let parentNode;

	parentIdList.forEach(function(id) {
		parentNode = E(id);
		returnStatus.push(parentNode.getAttribute("status"));
	});

	return returnStatus;
}

function setNodeVisibility(node) {

	let parentIdList = getParentIdList(node);
	let isCollapsed = false;

	// If one or more parents is collapsed
	parentIdList.forEach(function(id) {
		if(E("collapse" + id).checked) {
			isCollapsed = true;
		}
	});

	// This Node is hidden
	node.style.display = isCollapsed ? "none" : "block";
}

function isNodeVisible(node) {

	return "block" == node.style.display;
}

function isNodeCollapsed(node) {

	if(undefined == node) {
		return false;
	}

	let checkbox = E("collapse" + node.id);

	if(undefined == checkbox) {
		return false;
	}
	else {
		return checkbox.checked;
	}
}

function setNodeStyleByStatus(node) {

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

function setNodeStyleByCollapse(node) {

	let checkbox = E("collapse" + node.id);
	let button = checkbox.previousSibling;
	let isVisible = hasChildNode(node);

	// Set button icon
	button.innerHTML = checkbox.checked ? IMG.icon_expand : IMG.icon_collapse;

	// Show collapse button if node has child
	button.style.visibility = isVisible ? "visible" : "hidden";

	// Set collapse line
	checkbox.checked ? node.classList.add("node-frame-collapsed") : node.classList.remove("node-frame-collapsed");
}

function refreshNode(node) {
	
	let childrenIdList = getChildrenIdList(node);
	let parentsIdList = getParentIdList(node);

	// Refresh this node
	setLeftMarginByNodeLevel(node);
	setNodeStyleByStatus(node);
	setNodeStyleByCollapse(node);
	setNodeVisibility(node);

	// Refresh children
	let childNode;

	childrenIdList.forEach(function(id) {
		childNode = E(id);
		setLeftMarginByNodeLevel(childNode);
		setNodeStyleByStatus(childNode);
		setNodeStyleByCollapse(childNode);
		setNodeVisibility(childNode);
	});

	// Refresh parents
	let parentNode;

	parentsIdList.forEach(function(id) {
		parentNode = E(id);
		setLeftMarginByNodeLevel(parentNode);
		setNodeStyleByStatus(parentNode);
		setNodeStyleByCollapse(parentNode);
	});

	// Refresh previous
	let prevNode = getPreviousNode(node);

	if(undefined != prevNode) {
		setLeftMarginByNodeLevel(prevNode);
		setNodeStyleByStatus(prevNode);
		setNodeStyleByCollapse(prevNode);
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

function setLeftMarginByNodeLevel(node) {
	let level = getNodeLevel(node);
	node.style.margin = "0px 0px 0px " + (20 * (level - 1)) + "px";
	node.style.width = "calc(100% - " + (20 * (level - 1)) + "px)"
}

function getContents(node) {
	return E("contents" + node.id);
}

function removeTags(contents, position) {

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
					setNodeLevel(currentNode, startTabCount);
					refreshNode(currentNode);
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

		if(undefined == position) {
			setCaretPositionToLast(currentNode);
		}
		else {
			setCaretPositionToFirst(currentNode);
		}

	}, 0);
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

		log(node.id + " -> " + prevNode.id);
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

		log(node.id + " -> " + nextNode.id);
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

	// If base node is previous node, do not move.
	if(baseNode == getPreviousNode(node)) {
		return false;
	}

	// Copy this node below base node
	let copiedCurrentNode = createNode(baseNode
								, getNodeLevel(node)
								, getNodeStatus(node)
								, isNodeCollapsed(node)
								, getContents(node).innerHTML);

	// Copy this node's children
	let childrenIdList = getChildrenIdList(node);
	let childNode;
	baseNode = copiedCurrentNode;

	childrenIdList.forEach(function(id) {
		childNode = E(id);
		baseNode = createNode(baseNode
					, getNodeLevel(childNode)
					, getNodeStatus(childNode)
					, isNodeCollapsed(childNode)
					, getContents(childNode).innerHTML);
	});

	// Delete current node & children
	deleteNode(node);

	// Set focus on copied node
	setCaretPositionToFirst(copiedCurrentNode);

	setChanged(true);
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
		baseNode = E(baseNodeId);
	}
	else {
		baseNode = nextSiblingNode;
	}

	// Copy this node below base node
	let copiedCurrentNode = createNode(baseNode
								, getNodeLevel(node)
								, getNodeStatus(node)
								, isNodeCollapsed(node)
								, getContents(node).innerHTML);

	// Copy this node's children
	let childrenIdList = getChildrenIdList(node);
	let childNode;
	baseNode = copiedCurrentNode;

	childrenIdList.forEach(function(id) {
		childNode = E(id);
		baseNode = createNode(baseNode
					, getNodeLevel(childNode)
					, getNodeStatus(childNode)
					, isNodeCollapsed(childNode)
					, getContents(childNode).innerHTML);
	});

	// Delete current node & children
	deleteNode(node);

	// Set focus on copied node
	setCaretPositionToFirst(copiedCurrentNode);

	setChanged(true);
}

function executeToolbarCommand(checkbox) {

	let id = checkbox.id;

	// Is it checked
	let checked = E(id).checked;

	// Get node data
	let node = checkbox.parentNode.parentNode; // Toolbar -> Node

	if(id.indexOf("collapse") > -1) {
		executeCollapse(checkbox, node, true);
	}
	else if(id.indexOf("done") > -1) {
		executeDone(checkbox, node, true);
	}
	else if(id.indexOf("cancel") > -1) {
		executeCancel(checkbox, node, true);
	}
}

function executeCollapse(checkbox, node, byClick) {

	if(hasChildNode(node)) {

		refreshNode(node);

		let checked = checkbox.checked;

		// Set cursor if isn't by click
		if(!byClick) {
			checked ? setCaretPositionToFirst(node) : setCaretPositionToLast(node);
		}

		setChanged(true);
		setSaveIconVisibillity();

		log("ID = " + node.id + ", collapse = " + checked);
	}
}

function executeDone(checkbox, node, byClick) {
	
	// Disable cancel
	let cancelCheckbox = E("cancel" + node.id);
	cancelCheckbox.checked = false;
	let cancelLabel = cancelCheckbox.previousSibling;
	cancelLabel.innerHTML = IMG.icon_cancel_no;

	// Set icon
	let checked = checkbox.checked;
	checkbox.previousSibling.innerHTML = checked ? IMG.icon_done : IMG.icon_done_no;
	setNodeStatus(node, checked ? "D" : "N");

	refreshNode(node);

	// If auto collapse enabled, collapse/expand this Node
	if(SETTINGS.auto_collapse && hasChildNode(node)) {
		let collapseCheckbox = E("collapse" + node.id);
		collapseCheckbox.checked = checked;
		executeCollapse(collapseCheckbox, node, byClick);
	}

	// Set cursor to last of node if isn't by click
	if(!byClick) {
		setCaretPositionToLast(node);
	}
	
	setSaveIconVisibillity();

	log("ID = " + node.id + ", done = " + checked);
}

function executeCancel(checkbox, node, byClick) {
	
	// Disable done
	let doneCheckbox = E("done" + node.id);
	doneCheckbox.checked = false;
	let doneLabel = doneCheckbox.previousSibling;
	doneLabel.innerHTML = IMG.icon_done_no;

	// Set icon
	let checked = checkbox.checked;
	checkbox.previousSibling.innerHTML = checked ? IMG.icon_cancel : IMG.icon_cancel_no;
	setNodeStatus(node, checked ? "C" : "N");

	refreshNode(node);

	// If auto collapse enabled, collapse/expand this Node
	if(SETTINGS.auto_collapse && hasChildNode(node)) {
		let collapseCheckbox = E("collapse" + node.id);
		collapseCheckbox.checked = checked;
		executeCollapse(collapseCheckbox, node, byClick);
	}

	// Set cursor to last of node if isn't by click
	if(!byClick) {
		setCaretPositionToLast(node);
	}
	
	setSaveIconVisibillity();

	log("ID = " + node.id + ", cancel = " + checked);
}
