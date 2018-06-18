function onSignIn(googleUser) {

  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  USER.id = profile.getId();
  USER.name = profile.getName();

  console.log("USER.id = " + USER.id);
  console.log("USER.name = " + USER.name);

  // Add the Google access token to the Cognito credentials login map.
  AWS.config.region = 'ap-northeast-2'; // 리전
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:d0984c85-59eb-4a30-baed-cac8d1b750c5',
    Logins: {
      'accounts.google.com': USER.id
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
  });
}

function signOut() {
	
	var auth2 = gapi.auth2.getAuthInstance();

	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}