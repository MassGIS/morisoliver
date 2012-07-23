<?php

ini_set("display_errors",1);
error_reporting(E_ALL);

header("content-type: text/plain");

$bSent = mail("aleda.freeman@state.ma.us","test email","this is a test email from the production maps server");

if ($bSent === TRUE) {
	echo "mail sent";
} else {
	echo "error sending mail";
}

?>
