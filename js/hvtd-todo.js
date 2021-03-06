// Save todo
function saveTodo() {

	return new Promise(function(resolve, reject) {

		// No change do nothing
		if(!GLOBAL_VARIABLE.changed) {
			reject(new Error("No changes"));
		}
		else if(GLOBAL_VARIABLE.now_loading) {
			reject(new Error("Now processing... Can't save"));
		}
		else if(GLOBAL_VARIABLE.open_modal) {
			reject(new Error("Now modal opened."));
		}

		else {

			setChanged(false);

			// Set semaphore
			setSemaphore(true, getMessage("008"));

			log("Call...");

			// Get selected date
			let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

			// Set send data
			let params = {
				user: USER.id,
				yyyymmdd: yyyymmdd
			};
			let body = {
				"year": yyyymmdd.substring(0, 4),
				"month": yyyymmdd.substring(4, 6),
				"date": yyyymmdd.substring(6, 8),
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

			body.list = todoList;

			let additionalParams = {};

			// Call Generated API Gateway SDK
			API.todo.todoUserYyyymmddPost(params, body, additionalParams)
			.then(function(response) {

				// Release semaphore before return reslove/reject
				setSemaphore(false);

				resolve(response);
				setSaveIconVisibillity();

			}, function(error) {

				// Release semaphore return reslove/reject
				setSemaphore(false);

				reject(new Error("DB error!"));

				// If credential is expired, sign out
				if(403 == error.status) {
					signOut();
				}

			}).catch(function(error) {

				// Release semaphore return reslove/reject
				setSemaphore(false);

				log(JSON.stringify(error));

				// If credential is expired, sign out
				if(403 == error.status) {
					signOut();
				}

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

	// Check semaphore to prevent duplicate loading
	if(GLOBAL_VARIABLE.now_loading) {
		log("Now loading... Can't load another todo");
		return false;
	}
	else if(GLOBAL_VARIABLE.open_modal) {
		log("Now modal opened.");
		return false;
	}

	// Set send data
	let params = {
		user: USER.id
		, yyyymmdd: getYYYYMMDD(GLOBAL_VARIABLE.selected_date)
	};
	let body = {};
	let additionalParams = {};

	// Set semaphore
	setSemaphore(true, getMessage("007"));

	// Call Generated API Gateway SDK
	API.todo.todoUserYyyymmddGet(params, body, additionalParams)
	.then(function(response) {

		log("\n" + "COUNT = " + response.data.count
			+ "\n" + "MESSAGE = " + response.data.successMessage
			);

		return response.data;

	}, function(error) {

		log("\n" + "STATUS = " + error.status
			+ "\n" + "MESSAGE = " + error.data.message
			+ "\n" + "URL = " + error.config.url
			);

		// If credential is expired, sign out
		if(403 == error.status) {
			signOut();
		}

	}).then(function(data) {

		let todoList = data.list;

		// If has no data, initialize
		if(undefined == data.count || 0 == data.count) {

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

		log(JSON.stringify(error));

		// If credential is expired, sign out
		if(403 == error.status) {
			signOut();
		}

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

	// Delete todo after get user confirm
	openConfirmModal(getMessage("004")
		, function() {

			// Set send data
			let params = {
				yyyymmdd: getYYYYMMDD(GLOBAL_VARIABLE.selected_date)
				, user: USER.id
			};
			let body = {
				"Content-Type": "application/json" // Set header data into body for avoid 415 error
			};
			let additionalParams = {};

			// Set semaphore
			setSemaphore(true, getMessage("009"));

			// Call Generated API Gateway SDK
			API.todo.todoUserYyyymmddDelete(params, body, additionalParams)
			.then(function(response) {

				log(JSON.stringify(response.data));

				setBottomMessage("success", getMessage("012"));

			}, function(error) {

				log("\n" + "STATUS = " + error.status
					+ "\n" + "MESSAGE = " + error.data.message
					+ "\n" + "URL = " + error.config.url
					);

				// If credential is expired, sign out
				if(403 == error.status) {
					signOut();
				}
				else {
					setBottomMessage("error", getMessage("002"));
				}

			}).then(function() {

				clearTodo();
				createNode();
				setChanged(false);
				setSaveIconVisibillity();
				closeConfirmModal();
				
			}).catch(function(error) {

				log(JSON.stringify(error));

				// If credential is expired, sign out
				if(403 == error.status) {
					signOut();
				}
				else {
					setBottomMessage("error", getMessage("002"));
				}

			}).finally(function() {

				// Release semaphore
				setSemaphore(false);
			});
		},
			// Cancel: close modal window
			closeConfirmModal
		);
}

// Load previous todo
function loadPreviousTodo() {

	log("Call...");

	// Check semaphore to prevent duplicate loading
	if(GLOBAL_VARIABLE.now_loading) {
		log("Now loading... Can't load previous todo");
		return false;
	}
	else if(GLOBAL_VARIABLE.open_modal) {
		log("Now modal opened.");
		return false;
	}

	// Set send data
	let params = {
		user: USER.id
		, yyyymmdd: getYYYYMMDD(GLOBAL_VARIABLE.selected_date)
	};
	let body = {};
	let additionalParams = {};

	// Set semaphore
	setSemaphore(true, getMessage("007"));

	let copiedCount = 0;

	// Call Generated API Gateway SDK
	API.todo.todoUserYyyymmddPreviousGet(params, body, additionalParams)
	.then(function(response) {

		log("\n" + "COUNT = " + response.data.count
			+ "\n" + "MESSAGE = " + response.data.successMessage
			);

		return response;

	}, function(error) {

		log("\n" + "STATUS = " + error.status
			+ "\n" + "MESSAGE = " + error.data.message
			+ "\n" + "URL = " + error.config.url
			);

		// If credential is expired, sign out
		if(403 == error.status) {
			signOut();
		}

	}).then(function(response) {

		let data = response.data;
		let hasPrevData = data.hasData;

		// If has data, set data into page
		if(hasPrevData) {

			let previousNode = undefined;
			let todoList = data.item.list;

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

		log(JSON.stringify(error));

		// If credential is expired, sign out
		if(403 == error.status) {
			signOut();
		}

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

	// Set send data
	let params = {
		user: USER.id
		, searchString: searchString
	};
	let body = {};
	let additionalParams = {};

	// Set semaphore
	setSemaphore(true, getMessage("013"));

	// Call Generated API Gateway SDK
	API.todo.todoUserSearchSearchStringGet(params, body, additionalParams)
	.then(function(response) {

		log(JSON.stringify(response));

		return response;

	}, function(error) {

		// Release semaphore
		setSemaphore(false);

		log(JSON.stringify(error));

		// If credential is expired, sign out
		if(403 == error.status) {
			signOut();
		}

	}).then(function(response) {

		// Release semaphore
		setSemaphore(false);

		let result = response.data;

		if(0 == result.count) {
			setBottomMessage("warning", getMessage("014"));
		}
		else {
			openSearchResult(result);
		}
		
	}).catch(function(error) {

		// Release semaphore
		setSemaphore(false);

		log(JSON.stringify(error));

		// If credential is expired, sign out
		if(403 == error.status) {
			signOut();
		}
	});
}

// Get todo count
function getTodoCount(d) {

	log("Call...");

	let yyyymm = getYYYYMMDD(d).substring(0, 6);

	let fromDate = yyyymm + "01";
	let toDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);

	// Set send data
	let params = {
		user: USER.id
		, fromDate: fromDate
		, toDate: getYYYYMMDD(toDate)
	};
	let body = {};
	let additionalParams = {};

	// Call Generated API Gateway SDK
	API.todo.todoUserCountFromDateToDateGet(params, body, additionalParams)
	.then(function(response) {

		return response;

	}, function(error) {

		log(JSON.stringify(error));

		// If credential is expired, sign out
		if(403 == error.status) {
			signOut();
		}

	}).then(function(response) {

		let dateString = "";
		let result = response.data;
		let dateId = "";
		let dateElement = new Object();

		for(let currentDate = 1; currentDate <= toDate.getDate(); currentDate++) {

			if(currentDate < 10) {
				dateString = "" + yyyymm + "0" + currentDate;
			}
			else {
				dateString = "" + yyyymm + currentDate;
			}

			dateId = "calendar-date-" + dateString;
			dateElement = E(dateId);

			if(result.items[dateString].totalCount > 0) {
				dateElement.classList.add("has-data");
			}
		}
		
	}).catch(function(error) {

		log(JSON.stringify(error));

		// If credential is expired, sign out
		if(403 == error.status) {
			signOut();
		}
	});
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
}