<?php
// create curl resource
$ch = curl_init();

// set url
// проксируем во фласк-сервис
curl_setopt($ch, CURLOPT_URL, 'http://192.168.17.45:5024/find_geom/' . $_REQUEST['req_val']);

//return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// $output contains the output string
$output = curl_exec($ch);

// close curl resource to free up system resources
curl_close($ch);

echo $output;
