// Save todo
function saveTodo() {

	return new Promise(function(resolve, reject) {

		// No change do nothing
		if(!GLOBAL_VARIABLE.changed) {
			reject(Error("No changes"));
		}
		else if(GLOBAL_VARIABLE.now_loading) {
			reject(Error("Now processing... Can't save"));
		}
		else if(GLOBAL_VARIABLE.open_modal) {
			reject(ERROR("Now modal opened."));
		}

		else {

			setChanged(false);

			// Set semaphore
			setSemaphore(true, getMessage("008"));

			log("Call...");

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

			// Call API
			let apiUrl = getApiUrl(API.TODO, USER.id + "/" + yyyymmdd);


			callAPI(apiUrl, "POST", dataString).then(function(response) {

				resolve(response);
				setSaveIconVisibillity();

			}, function(error) {

				reject(Error("DB error!"));

			}).finally(function() {

				// Release semaphore
				setSemaphore(false);
			});
		}
	});
}

// Save todo(asynchronous)
// If has no follow up task, call this function.
function saveTodoAsync() {
	saveTodo().then(function() {}, function() {});
}

// Load todo
function loadTodo(focusNodeId) {

	log("Call...");

	// Get selected date
	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	// Call API
	let apiUrl = getApiUrl(API.TODO, USER.id + "/" + yyyymmdd);

	// Check semaphore to prevent duplicate loading
	if(GLOBAL_VARIABLE.now_loading) {
		log("Now loading... Can't load another todo");
		return false;
	}
	else if(GLOBAL_VARIABLE.open_modal) {
		log("Now modal opened.");
		return false;
	}

	// Set semaphore
	setSemaphore(true, getMessage("007"));

	callAPI(apiUrl, "GET").then(function(response) {

		log(response);

		return response;

	}, function(error) {

		log(error);

	}).then(function(response) {

		let data = JSON.parse(response);
		let todoList = data.list;

		// If has no data, initialize
		if(undefined == todoList || null == todoList || "" == todoList) {

			clearTodo();
			createNode();
			closeConfirmModal();

			setBottomMessage("warning", getMessage("011"));
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
		}

		setChanged(false);
		setSaveIconVisibillity();

	}).catch(function(error) {

		log(error);

	}).finally(function() {

		// Release semaphore
		setSemaphore(false);

		// If get to here from search, expand all node and focus found node.
		if(undefined != focusNodeId) {
			expandAll();
			E("contents" + focusNodeId).focus();

			setChanged(false); // Searching expand is not changing.
			setSaveIconVisibillity();
		}
	});
}

// Delete todo
function deleteTodo() {

	log("Call...");

	// Get selected date
	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	// Delete todo after get user confirm
	openConfirmModal(getMessage("004")
		, function() {

			// Call API
			let apiUrl = getApiUrl(API.TODO, USER.id + "/" + yyyymmdd);

			// Set semaphore
			setSemaphore(true, getMessage("009"));

			callAPI(apiUrl, "DELETE").then(function(response) {

				log(response);

			}, function(error) {

				log(error);

			}).then(function() {

				clearTodo();
				createNode();
				setChanged(false);
				setSaveIconVisibillity();
				closeConfirmModal();
				
			}).catch(function(error) {

				log(error);

			}).finally(function() {

				// Release semaphore
				setSemaphore(false);
				setBottomMessage("success", getMessage("012"));
			});
		}
		, 
			// Cancel: close modal window
			closeConfirmModal
		);
}

// Load previous todo
function loadPreviousTodo() {

	log("Call...");

	// Get selected date
	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	// Call API
	let apiUrl = getApiUrl(API.TODO, USER.id + "/" + yyyymmdd + "/previous");

	// Check semaphore to prevent duplicate loading
	if(GLOBAL_VARIABLE.now_loading) {
		log("Now loading... Can't load previous todo");
		return false;
	}
	else if(GLOBAL_VARIABLE.open_modal) {
		log("Now modal opened.");
		return false;
	}

	// Set semaphore
	setSemaphore(true, getMessage("007"));

	let copiedCount = 0;

	callAPI(apiUrl, "GET").then(function(response) {

		log(response);

		return response;

	}, function(error) {

		log(error);

	}).then(function(response) {

		let data = JSON.parse(response);
		let count = data.count;
		let todoList = data.item.list;

		// If has no data, nothing to do.
		if(0 == count) {

			alert("has no previous todo");
		}

		// If has data, set data into page
		else {

			let previousNode = undefined;

			if(hasData()) {
				previousNode = getNodeList().pop();
			}
			
			let isNone = false;
			let blockLevel = 9999;
			let blocked = false;

			// Copy only incomplete node(Level 1 node has status none)
			todoList.forEach(function(node) {

				if(1 == node.level) {

					blockLevel = 9999;
					blocked = false;

					if("N" == node.status) {
						isNone = true;
					}
					else {
						isNone = false;
					}
				}
				else if(!SETTINGS.copy_complete_child) {

					if("N" == node.status) {

						if(node.level <= blockLevel) {
							blocked = false;
							blockLevel = 9999;
						}
					}
					else {

						blocked = true;

						if(node.level < blockLevel) {
							blockLevel = node.level;
						}
					}
				}

				if(isNone && !blocked) {

					// If has no data, remove space node for input
					if(undefined == previousNode) {
						clearTodo();
					}

					previousNode = createNode(previousNode
						, node.level
						, node.status
						, node.collapse
						, node.contents);

					++copiedCount;
				}
			});

			if(0 == copiedCount) {
				setBottomMessage("warning", getMessage("010"));
			}
		}

	}).catch(function(error) {

		log(error);

	}).finally(function() {

		// Release semaphore
		setSemaphore(false);

		// If has change, set changed
		if(0 == copiedCount) {
			setChanged(false);
		}
		else {
			setChanged(true);
		}

		setSaveIconVisibillity();
	});
}

// Search todo
function searchTodo(searchString) {

	log("Call...");

	// Call API
	let apiUrl = getApiUrl(API.TODO, USER.id + "/search/" + searchString);

	// Set semaphore
	setSemaphore(true, getMessage("013"));

	callAPI(apiUrl, "GET").then(function(response) {

		log(response);

		return response;

	}, function(error) {

		// Release semaphore
		setSemaphore(false);

		log(error);

	}).then(function(response) {

		// Release semaphore
		setSemaphore(false);

		let result = JSON.parse(response);

		if(0 == result.count) {
			setBottomMessage("warning", getMessage("014"));
		}
		else {
			openSearchResult(result);
		}
		
	}).catch(function(error) {

		// Release semaphore
		setSemaphore(false);

		log(error);

	});
}

// Clear todo on page
function clearTodo() {

	log();

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
}