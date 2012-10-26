<?php
  $session     = time().rand();
  $scratch_dir = "/opt/massgis/wwwroot/temp/GeoServer_extract/$session";
  $web_dir     = "temp/GeoServer_extract/$session";

  mkdir($scratch_dir);

  header ("Content-Type:text/plain");

  // make sure this is legit
  if (preg_match('/^http:\/\/giswebservices.massgis.state.ma.us\//',$_REQUEST['url'])) {
    $r = file_get_contents(
       $_REQUEST['url']
      ,false
      ,stream_context_create(array('http' => array(
         'method'  => 'POST'
        ,'header'  => 'Content-type: text/xml'
        ,'content' => file_get_contents('php://input')
      )))
    );
    file_put_contents($scratch_dir.'/'.$_REQUEST['name'],$r);
    echo $web_dir.'/'.$_REQUEST['name'];
  }
  else {
    echo "Invalid request.";
  }
?>
