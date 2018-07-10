function onSignIn(googleUser) {

	let profile = googleUser.getBasicProfile();

	console.log('Google ID = ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Google Name = ' + profile.getName());
	console.log('Google Image URL = ' + profile.getImageUrl());
	console.log('Google Email = ' + profile.getEmail()); // This is null if the 'email' scope is not present.

	USER.id = profile.getEmail(); // Google email for hvtd ID
	USER.name = profile.getName(); // Google name for hvtd Name
	USER.image = profile.getImageUrl().replace("s96-c/", ""); // Google image for hvtd image

	let authResponse = googleUser.getAuthResponse();
	USER.token = authResponse.id_token; // Google id_token for hvtd user token

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
			log(JSON.stringify(error));
		});
	});
}

function onSignInFailure(e) {
	log(JSON.stringify(e));
	console.log("User signed in failed.");
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
}