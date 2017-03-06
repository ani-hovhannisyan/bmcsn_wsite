<?php
//Include GP config file && User class
include_once 'gpConfig.php';
include_once 'User.php';

if(isset($_GET['code'])){
	$gClient->authenticate($_GET['code']);
	$_SESSION['token'] = $gClient->getAccessToken();
	header('Location: ' . filter_var($redirectURL, FILTER_SANITIZE_URL));
}

if (isset($_SESSION['token'])) {
	$gClient->setAccessToken($_SESSION['token']);
}

if ($gClient->getAccessToken()) {
	//Get user profile data from google
	$gpUserProfile = $google_oauthV2->userinfo->get();
	
	//Initialize User class
	$user = new User();
	
	//Insert or update user data to the database
    $gpUserData = array(
        'oauth_provider'=> 'google',
        'oauth_uid'     => $gpUserProfile['id'],
        'first_name'    => $gpUserProfile['given_name'],
        'last_name'     => $gpUserProfile['family_name'],
        'email'         => $gpUserProfile['email'],
        'gender'        => $gpUserProfile['gender'],
        'locale'        => $gpUserProfile['locale'],
        'picture'       => $gpUserProfile['picture'],
        'link'          => $gpUserProfile['link']
    );
    $userData = $user->checkUser($gpUserData);
	
	//Storing user data into session
	$_SESSION['userData'] = $userData;
	
	//Render facebook profile data
    if(!empty($userData)){
        $output = '<h1>Google+ Profile Details </h1>';
        $output .= '<img src="'.$userData['picture'].'" width="300" height="220">';
        $output .= '<br/>Google ID : ' . $userData['oauth_uid'];
        $output .= '<br/>Name : ' . $userData['first_name'].' '.$userData['last_name'];
        $output .= '<br/>Email : ' . $userData['email'];
        $output .= '<br/>Gender : ' . $userData['gender'];
        $output .= '<br/>Locale : ' . $userData['locale'];
        $output .= '<br/>Logged in with : Google';
        $output .= '<br/><a href="'.$userData['link'].'" target="_blank">Click to Visit Google+ Page</a>';
        $output .= '<br/>Logout from <a href="logout.php">Google</a>'; 
    }else{
        $output = '<h3 style="color:red">Some problem occurred, please try again.</h3>';
    }
} else {
	$authUrl = $gClient->createAuthUrl();
	$output = '<a href="'.filter_var($authUrl, FILTER_SANITIZE_URL).'">' +
		  '<img src="src/res/google-plus.svg" alt=""/></a>';
}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>BMC Sticky Notes</title>
    <link rel="stylesheet" type="text/css" href="lib/jquery-ui.min.css"/>
    <link rel="stylesheet" type="text/css" href="lib/jquery-ui.structure.min.css"/>
    <link rel="stylesheet" type="text/css" href="lib/jquery-ui.theme.min.css"/>
    <link rel="stylesheet" href="src/css/main.css"/>
    <link rel="stylesheet" href="src/css/sticker.css"/>
    <link rel="stylesheet" href="src/css/canvas.css"/>
    <link rel="stylesheet" href="src/css/user.css"/>
    <link rel="stylesheet" href="src/css/login.css"/>
    <style type="text/css">
    h1{font-family:Arial, Helvetica, sans-serif;color:#999999;}
    </style>
  </head>
  <body>
    <script type="text/javascript" src="lib/jquery.min.js"></script>
    <script type="text/javascript" src="lib/jquery.js"></script>
    <script type="text/javascript" src="lib/jquery-ui.min.js"></script>
    <section id="stage">
      <h1 id="h_title">Business Model Canvas Sticky Notes</h1>
      </br>
      </br>
      <h1 id="h_title">COMING SOON ...</h1>
      </br>
      </br>
      <input id="i_login" type="text" placeholder="Username"/>
      <button id="b_login"><?php echo $output; ?></button>
    </section>
    <div class='notify' style='display:none'></div>
    <!-- Sticker class -->
    <script type="text/javascript" src="src/js/utils.js"></script>
    <script type="text/javascript" src="src/js/tools.js"></script>
    <script type="text/javascript" src="src/js/sticker.js"></script>
    <!-- Canvas class -->
    <script type="text/javascript" src="src/js/help.js"></script>
    <script type="text/javascript" src="src/js/canvas.js"></script>
    <!-- User class -->
    <script type="text/javascript" src="src/js/user.js"></script>
    <!-- Main Entry -->
    <script type="text/javascript" src="src/js/login.js"></script>
  </body>
</html>
