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

	if(GLOBAL_VARIABLE.now_loading) {
		createProcessingMessage(message);
	}
	else {
		removeProcessingMessage(message);
	}
}

function createProcessingMessage(messageString) {

	// Remove object first
	removeProcessingMessage();

	// Create object
	message = document.createElement("div");
	message.setAttribute("id", "processing-message");
	message.innerHTML = messageString;

	processing = document.createElement("div");
	processing.setAttribute("id", "processing");
	processing.appendChild(message);

	// Append object to body
	document.body.appendChild(processing);
}

function removeProcessingMessage() {

	let processing = E("processing");

	if(undefined != processing) {
		document.body.removeChild(processing);
	}
}

function setBottomMessage(type, message) {

	// Create object and append to body
	let bottomMessage = document.createElement("div");
	bottomMessage.setAttribute("id", "bottom-message");
	document.body.appendChild(bottomMessage);

	setTimeout(() => {

		// Show bottom message bar
		bottomMessage.innerHTML = "‣ " + message;
		bottomMessage.classList.add(type);
		bottomMessage.classList.add("show");

		setTimeout(() => {

			bottomMessage.classList.remove("show");
			bottomMessage.classList.remove(type);

			// Remove object from body
			setTimeout(() => {
				document.body.removeChild(bottomMessage);
			}, 200); // 0.2 sec for animation

		}, 2000); // Show during 2 sec

	}, 200); // 0.2 sec for animation
}
