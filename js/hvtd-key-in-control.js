function keyInCommon(e) {

	// Ctrl + S: Save
	if(e.ctrlKey && 83 == e.which) {
		saveTodo();
		return false;
	}

	// Ctrl + Shift + C: Calendar expand/collapse
	else if(e.ctrlKey &&  e.shiftKey && 67 == e.which) {
		setCalendarVisibility();
		return false;
	}
}

function keyInContents(e) {

	let currentNode = window.getSelection().focusNode.parentNode;

	if(-1 < currentNode.id.indexOf("contents")) {
		currentNode = currentNode.parentNode;
	}
	
	// Enter
	if(13 == e.which) {
		createNode(currentNode);
		setSaveIconVisibillity();
		return false;
	}

	// Tab
	else if(9 == e.which) {

		if(e.shiftKey) {
			setNodeLevel(currentNode, -1);
		}
		else {
			setNodeLevel(currentNode, 1);
		}

		refreshNode(currentNode);
		setSaveIconVisibillity();

		return false;
	}

	// Space
	else if(32 == e.which) {
		if(0 == getCaretOffset()) {

			if(e.shiftKey) {
				setNodeLevel(currentNode, -1);
				refreshNode(currentNode);
				setSaveIconVisibillity();
				return false;
			}
			else {
				setNodeLevel(currentNode, 1);
				refreshNode(currentNode);
				setSaveIconVisibillity();
				return false;
			}
		}
	}

	// Backspace
	else if(8 == e.which) {

		if(0 == getCaretOffset() ) {

			if(isNodeCanDelete(currentNode) && 0 == getContents(currentNode).innerHTML.length) {

				if(hasChildNode(currentNode)) {

					openModal(getMessage("001")
						, function() {
							deleteNode(currentNode, e.which);
							closeModal();
							setSaveIconVisibillity();
						}, closeModal);

				}
				else {
					deleteNode(currentNode, e.which);
					setSaveIconVisibillity();
				}
			}

			return false;
		}
	}

	// Delete
	else if(46 == e.which) {

		if(0 == getCaretOffset()) {

			if(isNodeCanDelete(currentNode) && 0 == getContents(currentNode).innerHTML.length) {
			
				if(hasChildNode(currentNode)) {

					openModal(getMessage("001")
						, function() {
							deleteNode(currentNode, e.which);
							closeModal();
							setSaveIconVisibillity();
						}, closeModal);

				}
				else {
					deleteNode(currentNode, e.which);
					setSaveIconVisibillity();
				}
			}

			return false;
		}
	}

	// Left arrow
	else if(37 == e.which) {

		// When caret is first position of Node
		if(0 == getCaretOffset()) {

			if(hasChildNode(currentNode)) {

				let collapse = E("collapse" + currentNode.id);

				if(!collapse.checked) {
					collapse.checked = true;
					executeToolbarCommand(collapse);
					setSaveIconVisibillity();
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

		let children = getContents(currentNode).childNodes;
		let cnt = children.length;
		let lastString = (0 == cnt) ? "" : children[cnt - 1];

		// When caret is last position of Node
		if(lastString.length == getCaretOffset()) {

			if(hasChildNode(currentNode)) {

				let collapse = E("collapse" + currentNode.id);

				if(collapse.checked) {
					collapse.checked = false;
					executeToolbarCommand(collapse);
					setSaveIconVisibillity();
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

		if(e.shiftKey) {
			moveNodeToPrevious(currentNode);
			setSaveIconVisibillity();
		}
		else {
			movePreviousNode(currentNode);
		}

		return false;
	}

	// Down arrow
	else if(40 == e.which) {

		if(e.shiftKey) {
			moveNodeToNext(currentNode);
			setSaveIconVisibillity();
		}
		else {
			moveNextNode(currentNode);
		}

		return false;
	}
}