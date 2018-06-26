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

		let position = getCaretPosition();
		let contents = getContents(currentNode);
		let remainContents = contents.innerHTML.substring(0, position);
		let splittedContents = contents.innerHTML.substring(position, contents.length);

		createNode(currentNode, undefined, undefined, undefined, splittedContents);
		contents.innerHTML = remainContents;

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
		if(0 == getCaretPosition()) {

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

		if(0 == getCaretPosition() ) {

			let currentContents = getContents(currentNode);

			if(isNodeCanDelete(currentNode) && 0 == currentContents.innerHTML.length) {

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

			else if(0 < currentContents.innerHTML.length && undefined != getPreviousNode(currentNode) && !hasChildNode(currentNode)) {

				let prevNode = getPreviousNode(currentNode);
				let prevContents = getContents(prevNode);
				let prevContentsLength = prevContents.innerHTML.length;
				prevContents.innerHTML = prevContents.innerHTML + currentContents.innerHTML;
				deleteNode(currentNode, e.which);
				setCaretPosition(prevContents, prevContentsLength);
				setSaveIconVisibillity();
			}

			return false;
		}
	}

	// Delete
	else if(46 == e.which) {

		if(0 == getCaretPosition()) {

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
		if(0 == getCaretPosition()) {

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
		if(lastString.length == getCaretPosition()) {

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
			let currentPos = getCaretPosition();

			movePreviousNode(currentNode);

			let prevNode = getPreviousVisibleNode(currentNode);

			if(undefined != prevNode) {

				let prevContents = getContents(prevNode);
				let prevContentsLength = prevContents.innerHTML.length;
				let newPos = prevContentsLength > currentPos ? currentPos : prevContentsLength;

				setCaretPosition(prevContents, newPos);
			}
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
			let currentPos =  getCaretPosition();

			moveNextNode(currentNode);

			let nextNode = getNextVisibleNode(currentNode);

			if(undefined != nextNode) {
				
				let nextContents = getContents(nextNode);
				let nextContentsLength = nextContents.innerHTML.length;
				let newPos = nextContentsLength > currentPos ? currentPos : nextContentsLength;

				setCaretPosition(nextContents, newPos);
			}
		}

		return false;
	}
}