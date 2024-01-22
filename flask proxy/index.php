<?php
// create curl resource
$ch = curl_init();

$route = 'find_geom';

if (array_key_exists('req_addr', $_REQUEST)) {
	$addr = urlencode($_REQUEST['req_addr']);
	if (!strlen($addr)) {
		$addr = 'empt_param';
	}
}
else {
	// запрос из кабинета инженера, другой запрос
	if (array_key_exists('req_addr_trs', $_REQUEST)) {
		$route = 'find_trs';
		$addr = urlencode($_REQUEST['req_addr_trs']);
		if (!strlen($addr)) {
			$addr = 'empt_param';
		}
	}
	else {
		$addr = 'empt_param';
	}
}

if (array_key_exists('req_custmr', $_REQUEST)) {
	$custmr = urlencode($_REQUEST['req_custmr']);
	if (!strlen($custmr)) {
		$custmr = 'empt_param';
	}
}
else {
	$custmr = 'empt_param';
}

// проксируем во фласк-сервис
curl_setopt($ch, CURLOPT_URL, 'http://192.168.17.45:5024/'.$route.'/'.$addr.'/'.$custmr);

//return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// $output contains the output string
$output = curl_exec($ch);

// close curl resource to free up system resources
curl_close($ch);

echo $output;
