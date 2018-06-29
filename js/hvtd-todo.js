// Save todo
function saveTodo() {

	// No change do nothing
	if(!isChanged()) {
		log("No changes");
		return false;
	}
	else if(GLOBAL_VARIABLE.now_loading) {
		log("Now loading... Can't save");
		return false;
	}

	setChanged(false);

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

		log(response);
		setSaveIconVisibillity();

	}, function(error) {

		log(error);

	});
}

// Load todo
function loadTodo() {

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

	// Set semaphore
	GLOBAL_VARIABLE.now_loading = true;

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
			closeModal();
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
		GLOBAL_VARIABLE.now_loading = false;
	});
}

// Delete todo
function deleteTodo() {

	log("Call...");

	// Get selected date
	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	// Delete todo after get user confirm
	openModal(getMessage("004")
		, function() {

			// Call API
			let apiUrl = getApiUrl(API.TODO, USER.id + "/" + yyyymmdd);

			callAPI(apiUrl, "DELETE").then(function(response) {

				log(response);

			}, function(error) {

				log(error);

			}).then(function() {

				clearTodo();
				createNode();
				setChanged(false);
				setSaveIconVisibillity();
				closeModal();
				
			}).catch(function(error) {

				log(error);

			});
		}
		, 
			// Cancel: close modal window
			closeModal
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

	// Set semaphore
	GLOBAL_VARIABLE.now_loading = true;

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

			// Copy only incomplete node(Level 1 node has status none)
			todoList.forEach(function(node) {

				if(1 == node.level) {

					if("N" == node.status) {

						isNone = true;
					}
					else {

						isNone = false;
					}
				}

				if(isNone) {

					// If has no data, remove space node for input
					if(undefined == previousNode) {
						clearTodo();
					}

					previousNode = createNode(previousNode
						, node.level
						, node.status
						, node.collapse
						, node.contents);
				}
			});		
		}

		setSaveIconVisibillity();

	}).catch(function(error) {

		log(error);

	}).finally(function() {

		// Release semaphore
		GLOBAL_VARIABLE.now_loading = false;
		setChanged(true);
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