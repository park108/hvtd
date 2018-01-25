// Save todo into storage
function saveTodo() {
	
	let date = GLOBAL_VARIABLE.selected_date;

	let yearString = date.getFullYear();
	let monthString = date.getMonth();
	let dateString = date.getDate();

	++monthString;
	monthString = (monthString < 10) ? "0" + monthString : monthString;
	dateString = (dateString < 10) ? "0" + dateString : dateString;

	let yyyymmdd = yearString + monthString + dateString;

	let todo = {
		"year": yearString,
		"month": monthString,
		"date": dateString,
		"list": null
	};

	let nodeList = getNodeList();
	let todoList = [];
	let nodeObject;

	nodeList.forEach(function(node) {

		nodeObject = new Object();
		nodeObject.id = node.id;
		nodeObject.level = node.getAttribute("level");
		nodeObject.status = node.getAttribute("status");
		nodeObject.collapse = document.getElementById("collapse" + node.id).checked;
		nodeObject.contents = document.getElementById("contents" + node.id).innerHTML;
		
		todoList.push(nodeObject);
	});

	todo.list = todoList;

	let jsonString = JSON.stringify(todo);

	localStorage.setItem(yyyymmdd, jsonString);

	setChanged(false);

	log("SAVE_TODO: " + yyyymmdd);
}

// Load todo for selected date
function loadTodo() {

	let yyyymmdd = getYYYYMMDD(GLOBAL_VARIABLE.selected_date);

	let data = localStorage.getItem(yyyymmdd);

	// No data
	if(undefined == data || null == data || "" == data) {

		let length = localStorage.length;
		let doConfirm = false;
		let key;
		let previousKey = "00000000";

		// If enabled Auto Copy, get previous todo key (yyyymmdd)
		if(GLOBAL_SETTING.auto_copy && length > 0) {

			for(let i = 0; i < localStorage.length; i++) {

				key = localStorage.key(i);

				if(key < yyyymmdd && previousKey < key) {

					doConfirm = true;
					previousKey = key;
				}
			}
		}

		// Copy from previous todo if confirmed
		if(doConfirm) {

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

			previousDataString = previousDateYear + "-"
				+ previousDateMonth + "-"
				+ previousDateDate
				+ "(" + previousDateWeek + ")";


			// Open confirm modal window
			openModal(getMessage("002", previousDataString)
				, function() {

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
					clearTodo();
					createNode();
					closeModal();
				});
		}
	}

	// If has data, get that data
	else {

		let todo = JSON.parse(data);
		let todoList = todo.list;
		let previousNode = undefined;

		todoList.forEach(function(node) {
			previousNode = createNode(previousNode
				, node.level
				, node.status
				, node.collapse
				, node.contents);
		});
	}

	log("LOAD_TODO: " + yyyymmdd);
}

// Delete todo from data storage
function deleteTodo(yyyymmdd) {

	openModal(getMessage("004")
		, function() {
			localStorage.removeItem(yyyymmdd);
			clearTodo();
			createNode();
			setChanged(false);
			closeModal();

			log("DELETE_TODO: " + yyyymmdd);
		}
		, closeModal);
}

// Clear todo on screen
function clearTodo() {

	let nodeList = getNodeList();
	let contents = document.getElementById("contents");

	nodeList.forEach(function(node) {
		contents.removeChild(node);
	});

	GLOBAL_VARIABLE.node_id = 0;

	log("CLEAR_TODO");
}
