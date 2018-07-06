function openSearch() {

	let search = E("search");
	search.style.display = "block";

	let searchString = E("search-string");
	searchString.focus();

	setContentsMargin();
}

function closeSearch() {

	let searchString = E("search-string");
	searchString.blur();
	
	let search = E("search");
	search.style.display = "none";

	setContentsMargin();
}

function toggleSearch() {
	
	let search = E("search");

	if("block" == search.style.display) {
		closeSearch();
	}
	else {
		openSearch();
	}
}

function getSearchResult() {

	let searchString = E("search-string").value;

	if("" != searchString) {

		searchTodo(searchString);
	}
}

function openSearchResult(result) {

	// Set modal open flag
	setModalOpen(true);

	// Create modal
	let searchResult = document.createElement("div");
	searchResult.setAttribute("id", "search-result");
	searchResult.classList.add("modal");
	searchResult.style.display = "block";
	document.body.appendChild(searchResult);

	// Create content
	let content = document.createElement("div");
	content.classList.add("modal-content");
	searchResult.appendChild(content);

	// Create settings close button
	let close = document.createElement("span");
	close.classList.add("close");
	close.addEventListener("click", closeSearchResult, false);
	close.innerHTML = "&times;";
	content.appendChild(close);

	// Create result
	let title = document.createElement("p");
	title.innerHTML = getKeyword("SEARCH_RESULT") + ": " + result.count;
	content.appendChild(title);

	let list = document.createElement("div");
	list.classList.add("modal-panel");
	content.appendChild(list);

	let node, date, nodeId, nodeContents;
	let yyyymmdd = "";
	let contentsString = "";

	result.item.forEach(function (resultItem) {

		// Create searched date
		if(yyyymmdd != resultItem.yyyymmdd) {

			yyyymmdd = resultItem.yyyymmdd;

			date = document.createElement("p");
			date.classList.add("search-result-date");
			date.innerHTML = yyyymmdd;

			list.appendChild(date);
		}

		node = document.createElement("div");
		node.classList.add("search-result-node");

		nodeId = document.createElement("div");
		nodeId.classList.add("search-result-node-id");
		nodeId.innerHTML = resultItem.id;
		node.appendChild(nodeId);

		contentsString = resultItem.contents;
		contentsString = contentsString.replace(result.searchString, "<a class=\"search-result-keyword\" onclick=\"goToSearchResult('" + yyyymmdd + "', '" + resultItem.id + "')\">" + result.searchString + "</a>");
		nodeContents = document.createElement("div");
		nodeContents.classList.add("search-result-node-content");
		nodeContents.innerHTML = contentsString;
		node.appendChild(nodeContents);

		list.appendChild(node);
	});

	// Create ok button
	let okButton = document.createElement("button");
	okButton.classList.add("button-ok");
	okButton.classList.add("button-set-single");
	okButton.addEventListener("click", closeSearchResult, false);
	okButton.innerHTML = getKeyword("OK");
	content.appendChild(okButton);
}

function closeSearchResult() {

	// Remove settings window
	let searchResult = E("search-result");

	if(undefined != searchResult) {
		document.body.removeChild(searchResult);

		// Remove modal open flag
		setModalOpen(false);
	}
}

function goToSearchResult(yyyymmdd, nodeId) {

	// Close modal
	closeSearchResult();

	log(yyyymmdd + ", " + nodeId);

	let year = yyyymmdd.substring(0, 4) * 1;
	let month = (yyyymmdd.substring(4, 6) * 1) - 1;
	let date = yyyymmdd.substring(6, 8) * 1;

	setDate(year, month, date, nodeId);
}