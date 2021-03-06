function openLogin(messageString) {

	// Set login display
	let login = E("login");
	login.style.display = "block";

	// Set message
	let message = E("login-message");
	message.innerHTML = messageString;
}

function closeLogin() {

	let login = E("login");
	login.style.display = "none";
}

function setUserInfo() {

	// Initialize user-info
	E("user-info").innerHTML = "";

	// If has token, create user-icon image and sign-out button in user-info element
	if(null != USER.token && "" != USER.token) {
		loadSettings();
	}
}

function createUserInfo() {

	let iconImage = document.createElement("img");
	iconImage.setAttribute("id", "user-icon-image");
	iconImage.setAttribute("src", USER.image);

	let userIcon = document.createElement("div");
	userIcon.setAttribute("id", "user-icon");
	userIcon.setAttribute("onclick", "toggleUserDropdown()");
	userIcon.classList.add("tooltip-left");
	userIcon.appendChild(iconImage);

	let userInfo = E("user-info");
	userInfo.appendChild(userIcon);
}

function toggleUserDropdown() {

	let userInfo = E("user-info");
	let userDropdown = E("user-dropdown");

	if(undefined == userDropdown) {

		let userDropdownIcon = document.createElement("img");
		userDropdownIcon.setAttribute("id", "user-dropdown-icon");
		userDropdownIcon.setAttribute("src", USER.image);

		let userDropdownName = document.createElement("div");
		userDropdownName.setAttribute("id", "user-dropdown-name");
		userDropdownName.innerHTML = USER.name;

		let userDropdownId = document.createElement("div");
		userDropdownId.setAttribute("id", "user-dropdown-id");
		userDropdownId.innerHTML = USER.id;

		let userDropdownInfo = document.createElement("div");
		userDropdownInfo.setAttribute("id", "user-dropdown-info");
		userDropdownInfo.appendChild(userDropdownIcon);
		userDropdownInfo.appendChild(userDropdownName);
		userDropdownInfo.appendChild(userDropdownId);

		let userDropdownSettings = document.createElement("a");
		userDropdownSettings.setAttribute("id", "user-dropdown-settings");
		userDropdownSettings.setAttribute("href", "#");
		userDropdownSettings.setAttribute("onclick", "openSettings()");
		userDropdownSettings.innerHTML = getKeyword("USER_DROPDOWN_SETTINGS");

		let userDropdownSignout = document.createElement("a");
		userDropdownSignout.setAttribute("id", "user-dropdown-signout");
		userDropdownSignout.setAttribute("href", "#");
		userDropdownSignout.setAttribute("onclick", "signOut()");
		userDropdownSignout.innerHTML = getKeyword("USER_DROPDOWN_SIGNOUT");

		userDropdown = document.createElement("div");
		userDropdown.setAttribute("id", "user-dropdown");
		userDropdown.classList.add("dropdown");
		userDropdown.appendChild(userDropdownInfo);
		userDropdown.appendChild(userDropdownSettings);
		userDropdown.appendChild(userDropdownSignout);

		userInfo.appendChild(userDropdown);

		userDropdown.style.display = "block";
	}
	else {
		userInfo.removeChild(userDropdown);
	}
}