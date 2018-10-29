function onSignInGoogle(googleUser) {

	let profile = googleUser.getBasicProfile();

	USER.id = profile.getEmail(); // Google email for hvtd ID
	USER.name = profile.getName(); // Google name for hvtd Name
	USER.image = profile.getImageUrl().replace("s96-c/", ""); // Google image for hvtd image
	USER.token = googleUser.getAuthResponse().id_token; // Google id_token for hvtd user token
	USER.id_provider = "Google";

	// Add the Google access token to the Cognito credentials login map.
	AWS.config.region = 'ap-northeast-2';

	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'ap-northeast-2:d0984c85-59eb-4a30-baed-cac8d1b750c5'
		, Logins: {
			'accounts.google.com': USER.token
		}
	});

	// Obtain AWS credentials
	AWS.config.credentials.get(function() {

		// Create new api client
		API.settings = apigClientFactory.newClient.settings({
			accessKey: AWS.config.credentials.accessKeyId
			, secretKey: AWS.config.credentials.secretAccessKey
			, sessionToken: AWS.config.credentials.sessionToken
			, region: AWS.config.region
		});

		API.constants = apigClientFactory.newClient.constants({
			accessKey: AWS.config.credentials.accessKeyId
			, secretKey: AWS.config.credentials.secretAccessKey
			, sessionToken: AWS.config.credentials.sessionToken
			, region: AWS.config.region
		});

		API.todo = apigClientFactory.newClient.todo({
			accessKey: AWS.config.credentials.accessKeyId
			, secretKey: AWS.config.credentials.secretAccessKey
			, sessionToken: AWS.config.credentials.sessionToken
			, region: AWS.config.region
		});

		loadTexts().then(function(result) {
			setUserInfo();
			closeLogin();

		}, function(error) {
			log(error);
		});
	});
}

function onSignInFailure(e) {
	signOut();
}

function signOut() {

	let auth2 = gapi.auth2.getAuthInstance();

	if(undefined != auth2.currentUser.get().getAuthResponse.id_token
		&& null != auth2.currentUser.get().getAuthResponse.id_token) {

		auth2.signOut().then(function () {

			setAutoSaveInterval(0);

			USER.id = "";
			USER.name = "";
			USER.token = "";
			USER.image = "";

			log('User signed out.');

			window.location.reload();
		});
	}
	else {

		setAutoSaveInterval(0);

		USER.id = "";
		USER.name = "";
		USER.token = "";
		USER.image = "";

		clearTodo();
		setUserInfo();
	}

	openLogin(getMessage("000"));
}