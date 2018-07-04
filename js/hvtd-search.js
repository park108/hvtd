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

		setSemaphore(true, getMessage("013"));

		log("Searching for '" + searchString + "' ...");

		// TODO: Searching code

		setTimeout(function() {

			setSemaphore(false);
			setBottomMessage("warning", getMessage("014"));

		}, 200);
	}
}
