<?php
session_start();

//Include Google client library 
include_once 'src/Google_Client.php';
include_once 'src/contrib/Google_Oauth2Service.php';

/*
 * Configuration and setup Google API
 */
$clientId = '591075947383-5hflkbsdfpfl7cphp5lncc6ouss6mmnl.apps.googleusercontent.com';
$clientSecret = 'LofDkRluvwsQPis2tF3eBV1H';
//$redirectURL = 'http://localhost/login_with_google_using_php/';
$redirectURL = 'http://bmc.connmo.net/oauth2cb'; //Callback URL

//Call Google API
$gClient = new Google_Client();
$gClient->setApplicationName('Login to bmc.connmo.net');
$gClient->setClientId($clientId);
$gClient->setClientSecret($clientSecret);
$gClient->setRedirectUri($redirectURL);

$google_oauthV2 = new Google_Oauth2Service($gClient);
?>
