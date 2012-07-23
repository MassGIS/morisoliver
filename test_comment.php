<?php

error_log("someone posted to the test_comment.php file");
//error_log("post body was");
//error_log(print_r($HTTP_RAW_POST_DATA,TRUE));

function do_post_request($url, $xml_req, $optional_headers = null) {
        $ses = curl_init("http://giswebservices.massgis.state.ma.us/geoserver/wfs");
        if ($ses === FALSE) {
error_log("error connecting");
error_log(print_r(curl_getinfo($ses),TRUE));
return "";
}
        curl_setopt($ses, CURLOPT_POST, TRUE);
        $headers = array(
'Content-type:text/xml',
'Content-Length:'.strlen($xml_req),
'Expect:');
        curl_setopt($ses, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ses, CURLOPT_POSTFIELDS, $xml_req);
        curl_setopt($ses, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ses, CURLOPT_FAILONERROR,TRUE);
        $ret = curl_exec($ses);
        if ($ret === FALSE) {
error_log(curl_error($ses));
return "";
}
        error_log("got response ".$ret);
        return $ret;
}

$url="http://giswebservices.massgis.state.ma.us/geoserver/wfs";
$xml_req=$HTTP_RAW_POST_DATA;

echo (do_post_request($url, $xml_req));

?>
