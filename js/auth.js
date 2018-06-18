function onSignIn(googleUser) {

  var profile = googleUser.getBasicProfile();

  console.log('Google ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Google Name: ' + profile.getName());
  console.log('Google Image URL: ' + profile.getImageUrl());
  console.log('Google Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  USER.id = profile.getEmail(); // Google email for hvtd ID
  USER.name = profile.getName(); // Google name for hvtd Name

  console.log("USER.id = " + USER.id);
  console.log("USER.name = " + USER.name);

  var authResponse = googleUser.getAuthResponse();
  USER.token = authResponse.id_token;
  console.log("USER.token = " + USER.token);


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
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;

    console.log("Amazon Cognito accessKeyId: " + accessKeyId);
    console.log("Amazon Cognito secretAccessKey: " + secretAccessKey);
    console.log("Amazon Cognito sessionToken: " + sessionToken);

    setUserInfo();
    closeModal();
  });
}

function signOut() {
	
	var auth2 = gapi.auth2.getAuthInstance();

	auth2.signOut().then(function () {
    USER.id = "";
    USER.name = "";
    USER.token = "";
		console.log('User signed out.');

    setUserInfo();
	});
}