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

// function onSignInTwitter() {

// 	let timestamp  = Math.floor(new Date().getTime()/1000);

// 	let urlSplit = document.URL.split("/");
// 	let callbackUrl = urlSplit[0] + "//" + urlSplit[2];

// 	let requestUrl = "https://api.twitter.com/oauth/request_token";
// 	let method = "POST";
// 	let signatureMethod = "HMAC-SHA1";
// 	let nonce = getNonce(32);
// 	let oAuthVersion = "1.0";

// 	// Make signature
// 	let paramString = getParamString(callbackUrl, TWITTER_KEYS.CONSUMER_KEY, nonce, signatureMethod, timestamp, TWITTER_KEYS.ACCESS_TOKEN, oAuthVersion);
// 	let baseString = getSignatureBaseString(method, requestUrl, paramString);
// 	let signingKey = percentEncode(TWITTER_KEYS.CONSUMER_SECRET) + "&" + percentEncode(TWITTER_KEYS.ACCESS_TOKEN_SECRET);
// 	let signature = getSignature("SHA-1", "TEXT", "B64", signingKey, baseString);

// 	log("paramString = " + paramString);
// 	log("baseString = " + baseString);
// 	log("signingKey = " + signingKey);
// 	log("signature = " + signature);

// 	// Make authorization header
// 	let authHeader = "OAuth ";
// 	let oauth_callback = "oauth_callback=\"" + percentEncode(callbackUrl) + "\"";
// 	let oauth_consumer_key = "oauth_consumer_key=\"" + TWITTER_KEYS.CONSUMER_KEY + "\"";
// 	let oauth_nonce = "oauth_nonce=\"" + nonce + "\"";
// 	let oauth_signature = "oauth_signature=\"" + percentEncode(signature) + "\"";
// 	let oauth_signature_method = "oauth_signature_method=\"" + signatureMethod + "\"";
// 	let oauth_timestamp = "oauth_timestamp=\"" + timestamp + "\"";
// 	let oauth_version = "oauth_version=\"" + oAuthVersion + "\"";

// 	authHeader = authHeader
// 				+ oauth_callback
// 				+ ", "
// 				+ oauth_consumer_key
// 				+ ", "
// 				+ oauth_nonce
// 				+ ", "
// 				+ oauth_signature
// 				+ ", "
// 				+ oauth_signature_method
// 				+ ", "
// 				+ oauth_timestamp
// 				+ ", "
// 				+ oauth_version;

// 	log("Authorization = " + authHeader);

// 	// Make and send request
// 	let req = getXMLHttpRequestObject();
// 	req.open(method, requestUrl, true);
// 	req.setRequestHeader("Authorization", authHeader);

// 	req.onreadystatechange = function(e) {

// 		if (req.readyState == 4) {
// 			if(req.status == 200) {
// 				log(req.responseText);
// 			}
// 			else {
// 				log("ERROR");
// 			}
// 		}
// 	};

// 	let body = {
// 		"oauth_callback": callbackUrl
// 	}

// 	req.send(body);
// }

// function getParamString(callbackUrl, consumerKey, nonce, signatureMethod, timestamp, accessToken, oAuthVersion) {

// 	let str = "oauth_callback=" + percentEncode(callbackUrl)
// 			+ "&"
// 			+ "oauth_consumer_key=" + percentEncode(consumerKey)
// 			+ "&"
// 			+ "oauth_nonce=" + percentEncode(nonce)
// 			+ "&"
// 			+ "oauth_signature_method=" + percentEncode(signatureMethod)
// 			+ "&"
// 			+ "oauth_timestamp=" + percentEncode(timestamp)
// 			+ "&"
// 			+ "oauth_version=" + percentEncode(oAuthVersion);

// 	return str;
// }

// function getSignatureBaseString(method, requestUrl, paramString) {

// 	let str = method + "&"
// 			+ percentEncode(requestUrl) + "&"
// 			+ percentEncode(paramString);

// 	return str;
// }

// function getSignature(variant, inputType, outputType, key, text) {

// 	let shaObj = new jsSHA(variant, inputType);
// 	shaObj.setHMACKey(key, inputType);
// 	shaObj.update(text);
// 	return shaObj.getHMAC(outputType);
// }

// function getNonce(length) {
// 	const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz'
// 	const result = [];
// 	window.crypto.getRandomValues(new Uint8Array(length)).forEach(c =>
// 		result.push(charset[c % charset.length]));
// 	return result.join('');
// }

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
}