<?php

$test = $_GET['test'];

if( $test !== "true" ) {

	$MY_CONSUMER_KEY    = '9Ak6ytr9JwDirhh4OtttVQNYYuEQSOWH';
	$MY_CONSUMER_SECRET = 'neWPXGXalxXWGTtj';
	$url    = 'https://developer.api.autodesk.com/authentication/v1/authenticate';
	$data   = 'client_id='.$MY_CONSUMER_KEY.'&client_secret='.$MY_CONSUMER_SECRET.'&grant_type=client_credentials';
	$header = array( 'Content-Type: application/x-www-form-urlencoded' );

	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $data );   // --data
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $header ); // --header
	curl_exec( $ch );
	curl_close( $ch );

} else {

	header( 'Content-Type: application/json; charset=utf-8' );
	echo '{"token_type":"Bearer","expires_in":1799,"access_token":"XXXXXXXX"}';

}

// header( 'Content-Type: text/javascript; charset=utf-8' );

?>
