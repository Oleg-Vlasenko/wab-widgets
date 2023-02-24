<?php
// create curl resource
$ch = curl_init();

// set url
// проксируем во фласк-сервис
curl_setopt($ch, CURLOPT_URL, 'http://192.168.17.45:5024/find_geom/'.urlencode($_REQUEST['req_addr']).'/'.urlencode($_REQUEST['req_custmr']));

//return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// $output contains the output string
$output = curl_exec($ch);

// close curl resource to free up system resources
curl_close($ch);

echo $output;
