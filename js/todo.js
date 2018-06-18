// Call Todo API
let httpRequest;

function callTodoAPI(method, yyyymmdd, callback, data) {
	
	if(window.XMLHttpRequest) {
		httpRequest = new XMLHttpRequest();
	}
	else if(window.ActiveXObject) { // Above IE 8
		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}

	let apiUrl = "https://tfsds3iaxe.execute-api.ap-northeast-2.amazonaws.com" // API Gateway URL
		+ "/test" // API Stage name
		+ "/todo" // API Name
		+ "/" + USER.id // TODO: Param: User account
		+ "/" + yyyymmdd // Param: yyyymmdd

	httpRequest.onreadystatechange = callback;
	httpRequest.open(method, apiUrl, true);
	httpRequest.setRequestHeader("Content-type", "application/json");

	if("GET" == method) {
		httpRequest.send();
	}
	else {
		httpRequest.send(data);	
	}

	log("CALL TODO API: " + method + " " + apiUrl + " ... " + "DATA = {" + data + "}");
}

// Save todo into storage
function saveTodo() {

	// No change do nothing
	if(!isChanged()) {
		return false;
	}
	
	// Get selected date
	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	let yearString = yyyymmdd.substring(0, 4);
	let monthString = yyyymmdd.substring(4, 6);
	let dateString = yyyymmdd.substring(6, 8);

	// Set date for todo
	let todo = {
		"year": yearString,
		"month": monthString,
		"date": dateString,
		"list": null
	};

	// Set node list
	let nodeList = getNodeList();
	let todoList = [];
	let nodeObject;

	nodeList.forEach(function(node) {

		nodeObject = new Object();
		nodeObject.id = node.id;
		nodeObject.level = node.getAttribute("level");
		nodeObject.status = node.getAttribute("status");
		nodeObject.collapse = E("collapse" + node.id).checked;
		nodeObject.contents = E("contents" + node.id).innerHTML;
		
		todoList.push(nodeObject);
	});

	todo.list = todoList;

	// Convert data to JSON string
	let dataString = JSON.stringify(todo);

	// Save data for selected date
	setChanged(false);
	callTodoAPI("POST", yyyymmdd, callbackSaveTodo, dataString);

	log("SAVE_TODO: " + yyyymmdd);
}

// Callback function after save todo
function callbackSaveTodo() {

	if (httpRequest.readyState === 4) {

		if (httpRequest.status === 200) {
			log("CALLBACK_SAVE_TODO: OK.");
		}
		else {
			log("CALLBACK_SAVE_TODO: Save failed.");
		}
	}
}

// Load todo for selected date
function loadTodo() {

	// Get selected date
	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	// Get data for selected date
	callTodoAPI("GET", yyyymmdd, callbackLoadTodo);

	log("LOAD_TODO: " + yyyymmdd);
}

// Callback function after load todo
function callbackLoadTodo() {

	if (httpRequest.readyState === 4) {

		if (httpRequest.status === 200) {

			let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);
			let data = httpRequest.responseText;
			let todo = JSON.parse(data);
			let todoList = todo.list;

			// If has no data
			if(undefined == todoList || null == todoList || "" == todoList) {

				let length = localStorage.length;
				let doConfirm = false;
				let key;
				let previousKey = "00000000";

				// If enabled Auto Copy, get previous todo key (yyyymmdd)
				if(SETTINGS.auto_copy && length > 0) {

					for(let i = 0; i < localStorage.length; i++) {

						key = localStorage.key(i);

						if(key < yyyymmdd && previousKey < key) {

							doConfirm = true;
							previousKey = key;
						}
					}
				}

				// Copy from previous todo if confirmed
				if(false) {

					// Set previous data string for Confirm popup
					let previousDataString;

					let previousDateYear = previousKey.substring(0, 4);
					let previousDateMonth = previousKey.substring(4, 6);
					let previousDateDate = previousKey.substring(6, 8);

					log(previousDateYear + "-" + previousDateMonth + "-" + previousDateDate)

					let previousDate = new Date(previousDateYear
						, (previousDateMonth * 1) - 1
						, (previousDateDate * 1));

					let previousDateWeek = getWeekText(previousDate.getDay());

					// YYYY-MM-DD(WEEK)
					previousDataString = previousDateYear + "-"
						+ previousDateMonth + "-"
						+ previousDateDate
						+ "(" + previousDateWeek + ")";

					// Open copy confirm modal window
					openModal(getMessage("002", previousDataString)
						, function() {

							// Confirm: copy todo from previous todo
							data = localStorage.getItem(previousKey);

							let todo = JSON.parse(data);
							let todoList = todo.list;
							let previousNode = undefined;
							let startDeleteLevel = 9999;

							todoList.forEach(function(node) {

								// Skip completed node
								if("N" == node.status
									&& startDeleteLevel >= node.level) {

									previousNode = createNode(previousNode
										, node.level
										, node.status
										, node.collapse
										, node.contents);

									startDeleteLevel = 9999;
								}
								else {

									if(startDeleteLevel > node.level) {

										startDeleteLevel = node.level;
									}
								}

							});

							setChanged(true);
							closeModal();
						}, function() {

							// Cancel: New Todo
							clearTodo();
							createNode();
							closeModal();
						});
				}

				// New todo
				else {
					clearTodo();
					createNode();
					closeModal();
					
					setChanged(false);
				}

				log("CALLBACK_LOAD_TODO: OK.");
				setUserInfo();
			}

			// If has data, set data into page
			else {

				let previousNode = undefined;

				todoList.forEach(function(node) {
					previousNode = createNode(previousNode
						, node.level
						, node.status
						, node.collapse
						, node.contents);
				});
				
				setChanged(false);
			}
		}
		else {
			log("CALLBACK_LOAD_TODO: Load failed.");
			setUserInfo();
		}
	}
}

// Delete todo from data storage
function deleteTodo() {

	// Get selected date
	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	openModal(getMessage("004")
		, function() {

			// Confirm: delete data from storage and initialize page
			callTodoAPI("DELETE", yyyymmdd, callbackDeleteTodo);

			log("DELETE_TODO: " + yyyymmdd);
		}
		, 
			// Cancel: close modal window
			closeModal
		);
}

// Callback function after delete todo
function callbackDeleteTodo() {

	if (httpRequest.readyState === 4) {

		if (httpRequest.status === 200) {
			clearTodo();
			createNode();
			setChanged(false);
			closeModal();

			log("CALLBACK_DELETE_TODO: OK.");
		}
		else {
			log("CALLBACK_DELETE_TODO: Delete failed.");
		}
	}
}

// Clear todo on page
function clearTodo() {

	// Get node list
	let nodeList = getNodeList();
	let contents = E("contents");

	// Remove all node
	nodeList.forEach(function(node) {
		contents.removeChild(node);
		setChanged(true);
	});

	// Initialize node id
	GLOBAL_VARIABLE.node_id = 0;

	log("CLEAR_TODO");
}