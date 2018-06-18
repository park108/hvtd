function onSignIn(googleUser) {

  let profile = googleUser.getBasicProfile();

  log('Google ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  log('Google Name: ' + profile.getName());
  log('Google Image URL: ' + profile.getImageUrl());
  log('Google Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  USER.id = profile.getEmail(); // Google email for hvtd ID
  USER.name = profile.getName(); // Google name for hvtd Name
  USER.image = profile.getImageUrl(); // Google image for hvtd image

  log("USER.id = " + USER.id);
  log("USER.name = " + USER.name);
  log("USER.image = " + USER.image);

  let authResponse = googleUser.getAuthResponse();
  USER.token = authResponse.id_token;
  log("USER.token = " + USER.token);

  // Add the Google access token to the Cognito credentials login map.
  AWS.config.region = 'ap-northeast-2';

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:d0984c85-59eb-4a30-baed-cac8d1b750c5',
    Logins: {
      'accounts.google.com': USER.token
    }
  });

  // Obtain AWS credentials
  AWS.config.credentials.get(function() {

    // Credentials will be available when this function is called.
    let accessKeyId = AWS.config.credentials.accessKeyId;
    let secretAccessKey = AWS.config.credentials.secretAccessKey;
    let sessionToken = AWS.config.credentials.sessionToken;

    log("Amazon Cognito accessKeyId: " + accessKeyId);
    log("Amazon Cognito secretAccessKey: " + secretAccessKey);
    log("Amazon Cognito sessionToken: " + sessionToken);

    setUserInfo();
    closeModal();
  });
}

function onSignInFailure() {

}

function signOut() {
	
	let auth2 = gapi.auth2.getAuthInstance();

	auth2.signOut().then(function () {
    USER.id = "";
    USER.name = "";
    USER.token = "";
    USER.image = "";

		log('User signed out.');

    setUserInfo();

	});
}