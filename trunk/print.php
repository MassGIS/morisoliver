<?php
  $id      = time().'.'.rand();
  $tmp_dir = '/tmp/';
  $tmp_url = '/tmp/';

  $json = json_decode($HTTP_RAW_POST_DATA);

  $w = str_replace('px','',$json->{'w'});
  $h = str_replace('px','',$json->{'h'});
  $bbox = implode(',',$json->{'extent'});

  $canvas = new Imagick();
  $canvas->newImage($w,$h,new ImagickPixel('white'));
  $canvas->setImageFormat('png');

  $legends = array();
  $titles  = array();
  $legSize = array(600,0);

  foreach ($json->{'layers'} as $k => $v) {
    $handle = fopen($tmp_dir.$id.'.png','w');
    fwrite($handle,@file_get_contents($v->{'img'}."&width=$w&height=$h&bbox=$bbox"));
    fclose($handle);
    $img = new Imagick($tmp_dir.$id.'.png');
    $canvas->compositeImage($img,imagick::COMPOSITE_OVER,0,0);

    $handle = fopen($tmp_dir.$id.'.'.count($legends).'.png','w');
    fwrite($handle,@file_get_contents(mkLegendUrl($v->{'legend'})));
    fclose($handle);
    array_push($legends,new Imagick($tmp_dir.$id.'.'.count($legends).'.png'));
    array_push($titles,$k);
    if ($legends[count($legends)-1]->getImageWidth() > $legSize[0]) {
      $legSize[0] = $legends[count($legends)-1]->getImageWidth();
    }
    $legSize[1] += $legends[count($legends)-1]->getImageHeight() + 20;
  }
  $canvas->writeImage($tmp_dir.$id.'.png');

  $canvas = new Imagick();
  $canvas->newImage($legSize[0],$legSize[1],new ImagickPixel('white'));
  $canvas->setImageFormat('png');
  $runningHt = 15;
  for ($i = 0; $i < count($legends); $i++) {
    $draw = new ImagickDraw();
    $draw->setFont('Helvetica');
    $draw->setFontSize(12);
    $draw->annotation(5,$runningHt,$titles[$i]);
    $canvas->drawImage($draw);
    $canvas->compositeImage($legends[$i],imagick::COMPOSITE_OVER,0,$runningHt);
    $runningHt += $legends[$i]->getImageHeight() + 20;
  }
  $canvas->writeImage($tmp_dir.$id.'.legend.png');

  function mkLegendUrl($u) {
    return preg_replace('/&(STYLES|SRS)[^&]+/','',$u);
  }

  $handle = fopen($tmp_dir.$id.'.html','w');
  fwrite($handle,"<html><head><title>".$_REQUEST['title']."</title><style>td {vertical-align : top} img {border : 1px solid gray}</style></head><body><table><tr><td><img src='$tmp_url$id.png'></td><td><img src='$tmp_url$id.legend.png'></td></tr></table></body></html>");
  fclose($handle);

  echo json_encode(array('html' => "$tmp_url$id.html",'map' => "$tmp_url$id.png",'legend' => "$tmp_url$id.legend.png"));
?>
