window._config = {
    cognito: {
        userPoolId: 'ap-northeast-2_27STOOpXC', // e.g. us-east-2_uXboG5pAb
        userPoolClientId: '3u6u4mjhv8k45soigttas5fikm', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
        region: 'ap-northeast-2' // e.g. us-east-2
    },
    api: {
        invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
    }
};

// Amazon Cognito 인증 공급자를 초기화합니다
// AWS.config.region = 'ap-northeast-2'; // 리전
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'ap-northeast-2:d0984c85-59eb-4a30-baed-cac8d1b750c5',
// });
function onSignIn(googleUser) {

  var profile = googleUser.getBasicProfile();
  
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
	
	var auth2 = gapi.auth2.getAuthInstance();

	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}

function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {

     // Add the Google access token to the Cognito credentials login map.
     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-2:d0984c85-59eb-4a30-baed-cac8d1b750c5',
        Logins: {
           'accounts.google.com': authResult['id_token']
        }
     });

     // Obtain AWS credentials
     AWS.config.credentials.get(function(){
        // Access AWS resources here.
     });
  }
}