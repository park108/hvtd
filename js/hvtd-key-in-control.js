function keyInCommon(e) {

	// Alt + F: Search
	if(e.altKey && 70 == e.which) {

		e.stopImmediatePropagation();

		// Check semaphore
		if(!GLOBAL_VARIABLE.now_loading && !GLOBAL_VARIABLE.open_modal) {
			toggleSearch();
		}

		return false;
	}

	// Alt + T: Go today
	else if(e.altKey && 84 == e.which) {

		e.stopImmediatePropagation();

		// Check semaphore
		if(!GLOBAL_VARIABLE.now_loading && !GLOBAL_VARIABLE.open_modal) {
			setToday();
		}

		return false;
	}

	// Alt + C: Calendar expand/collapse
	else if(e.altKey && 67 == e.which) {

		e.stopImmediatePropagation();

		// Check semaphore
		if(!GLOBAL_VARIABLE.now_loading && !GLOBAL_VARIABLE.open_modal) {
			setCalendarVisibility();
		}

		return false;
	}

	// Alt + S: Save
	else if(e.altKey && 83 == e.which) {

		e.stopImmediatePropagation();

		// Check semaphore
		if(!GLOBAL_VARIABLE.now_loading && !GLOBAL_VARIABLE.open_modal) {
			saveTodo().then(function() {}, function() {}).finally(function() {
			});
		}

		return false;
	}

	// Alt + 1: Expand all
	else if(e.altKey && 49 == e.which) {

		e.stopImmediatePropagation();

		// Check semaphore
		if(!GLOBAL_VARIABLE.now_loading && !GLOBAL_VARIABLE.open_modal) {
			expandAll();
		}

		return false;
	}

	// Alt + 2: Collapse all
	else if(e.altKey && 50 == e.which) {

		e.stopImmediatePropagation();

		// Check semaphore
		if(!GLOBAL_VARIABLE.now_loading && !GLOBAL_VARIABLE.open_modal) {
			collapseAll();
		}

		return false;
	}

	// Ctrl + Alt + Left arrow: go to yesterday
	else if(e.ctrlKey && e.altKey && 37 == e.which) {

		e.stopImmediatePropagation();

		// Check semaphore
		if(!GLOBAL_VARIABLE.now_loading && !GLOBAL_VARIABLE.open_modal) {
			setYesterday();
		}

		return false;
	}

	// Ctrl + Alt + Right arrow: go to tomorrow
	else if(e.ctrlKey && e.altKey && 39 == e.which) {

		e.stopImmediatePropagation();

		// Check semaphore
		if(!GLOBAL_VARIABLE.now_loading && !GLOBAL_VARIABLE.open_modal) {
			setTomorrow();
		}

		return false;
	}

	// Ctrl + Up arrow: go to first node
	else if(e.ctrlKey && 38 == e.which) {

		e.stopImmediatePropagation();

		moveFirstNode();

		return false;
	}

	// Ctrl + Down arrow: go to last node
	else if(e.ctrlKey && 40 == e.which) {

		e.stopImmediatePropagation();

		moveLastNode();

		return false;
	}
}

function keyInContents(e) {

	// Return false in key combination in keyInCommon()
	if(e.altKey && 70 == e.which) return false;
	else if(e.altKey && 84 == e.which) return false;
	else if(e.altKey && 67 == e.which) return false;
	else if(e.altKey && 83 == e.which) return false;
	else if(e.altKey && 49 == e.which) return false;
	else if(e.altKey && 50 == e.which) return false;
	else if(e.ctrlKey && e.altKey && 37 == e.which) return false;
	else if(e.ctrlKey && e.altKey && 39 == e.which) return false;
	else if(e.ctrlKey && 38 == e.which) return false;
	else if(e.ctrlKey && 40 == e.which) return false;

	let currentNode = window.getSelection().focusNode.parentNode;

	if(-1 < currentNode.id.indexOf("contents")) {
		currentNode = currentNode.parentNode;
	}

	// Reset max caret position
	if(38 != e.which && 40 != e.which) {
		GLOBAL_VARIABLE.max_position = 0;
	}
	
	// Enter
	if(13 == e.which) {

		let position = getCaretPosition();
		let contents = getContents(currentNode);
		let contentsString = getContentsString(currentNode);
		let remainContents = contentsString.substring(0, position);
		let splittedContents = contentsString.substring(position, contentsString.length);

		// log("POS = " + position);
		// log("CURR_CONTENTS = " + contentsString);
		// log("REMN_CONTENTS = " + remainContents);
		// log("SPLT_CONTENTS = " + splittedContents);

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
			let currentNodeLevel = getNodeLevel(currentNode);

			if(currentNodeLevel > 1) {

				setNodeLevel(currentNode, -1);
				refreshNode(currentNode);
			}

			else {

				if(isNodeCanDelete(currentNode) && 0 == currentContents.innerHTML.length) {

					if(hasChildNode(currentNode)) {

						openConfirmModal(getMessage("001")
							, function() {
								deleteNode(currentNode, e.which);
								closeConfirmModal();
								setSaveIconVisibillity();
							}, closeConfirmModal);

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
			}

			return false;
		}
	}

	// Delete
	else if(46 == e.which) {

		if(0 == getCaretPosition()) {

			if(isNodeCanDelete(currentNode) && 0 == getContents(currentNode).innerHTML.length) {
			
				if(hasChildNode(currentNode)) {

					openConfirmModal(getMessage("001")
						, function() {
							deleteNode(currentNode, e.which);
							closeConfirmModal();
							setSaveIconVisibillity();
						}, closeConfirmModal);

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

				if(GLOBAL_VARIABLE.max_position < currentPos) {
					GLOBAL_VARIABLE.max_position = currentPos;
				}

				let prevContents = getContents(prevNode);
				let prevContentsString = getContentsString(prevNode);
				let prevContentsLength = prevContentsString.length;
				let newPos = prevContentsLength > GLOBAL_VARIABLE.max_position ? GLOBAL_VARIABLE.max_position : prevContentsLength;
				// log("maxPos= " + GLOBAL_VARIABLE.max_position);
				// log("prevPos= " + prevContentsLength);
				// log("newPos= " + newPos);

				if(newPos > 0) {
					setCaretPosition(prevContents, newPos);
				}
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

				if(GLOBAL_VARIABLE.max_position < currentPos) {
					GLOBAL_VARIABLE.max_position = currentPos;
				}
				
				let nextContents = getContents(nextNode);
				let nextContentsString = getContentsString(nextNode);
				let nextContentsLength = nextContentsString.length;
				let newPos = nextContentsLength > GLOBAL_VARIABLE.max_position ? GLOBAL_VARIABLE.max_position : nextContentsLength;
				// log("maxPos= " + GLOBAL_VARIABLE.max_position);
				// log("nextPos= " + nextContentsLength);
				// log("newPos= " + newPos);

				if(newPos > 0) {
					setCaretPosition(nextContents, newPos);
				}
			}
		}

		return false;
	}
}

function handleTouchStart(e) {
	
	let touches = e.changedTouches;
	GLOBAL_VARIABLE.touch_x = touches[0].clientX;
	GLOBAL_VARIABLE.touch_y = touches[0].clientY;
}

function handleTouchEnd(e) {

	// Check semaphore
	if(GLOBAL_VARIABLE.now_loading || GLOBAL_VARIABLE.open_modal) {

		log("Swipe event blocked now");
		
		return false;
	}

	if(null == GLOBAL_VARIABLE.touch_x || null == GLOBAL_VARIABLE.touch_y) {
		return false;
	}

	let touches = e.changedTouches;
	xDiff = touches[0].clientX - GLOBAL_VARIABLE.touch_x;
	yDiff = touches[0].clientY - GLOBAL_VARIABLE.touch_y;

	let isHorizontalMove = (Math.abs(xDiff) > Math.abs(yDiff)); 
	let isVerticalMove = !isHorizontalMove;

	let moveRight = isHorizontalMove && xDiff > 0;
	let moveLeft = isHorizontalMove && xDiff < 0;
	let moveUp = isVerticalMove && yDiff < 0;
	let moveDown = isVerticalMove && yDiff > 0;

	// Swipe to Right
	if(moveRight && Math.abs(xDiff) > GLOBAL_VARIABLE.touch_sensitivity) {
		setYesterday();
	}

	// Swipe to Left
	else if(moveLeft && Math.abs(xDiff) > GLOBAL_VARIABLE.touch_sensitivity) {
		setTomorrow();
	}

	// Swipe to Up
	else if(moveUp && Math.abs(yDiff) > GLOBAL_VARIABLE.touch_sensitivity) {
		log("Swipe to Up");
	}

	// Swipe to Down
	else if(moveDown && Math.abs(yDiff) > GLOBAL_VARIABLE.touch_sensitivity) {
		log("Swipe to Down");
	}

	GLOBAL_VARIABLE.touch_x = null;
	GLOBAL_VARIABLE.touch_y = null;
}