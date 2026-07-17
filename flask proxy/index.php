<?php
// create curl resource
$ch = curl_init();

// ------------------------------------------------------------
// Чтение конфигурации
// ------------------------------------------------------------
$configFile = __DIR__ . '/widget_config.json';

if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Configuration file not found.'
    ]);
    exit;
}

$configContent = file_get_contents($configFile);
$config = json_decode($configContent, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Invalid JSON: ' . json_last_error_msg()
    ]);
    exit;
}

// Получаем URL из конфига
$flaskUrl = $config['flaskUrl'] ?? 'http://192.168.17.47:5024';

// ------------------------------------------------------------
// Логика маршрутов
// ------------------------------------------------------------
$route = 'find_geom';

if (array_key_exists('req_addr', $_REQUEST)) {
    $addr = urlencode($_REQUEST['req_addr']);
    if (!strlen($addr)) {
        $addr = 'empt_param';
    }
} else {
    // запрос из кабинета инженера, другой запрос
    if (array_key_exists('req_addr_trs', $_REQUEST)) {
        $route = 'find_trs';
        $addr = urlencode($_REQUEST['req_addr_trs']);
        if (!strlen($addr)) {
            $addr = 'empt_param';
        }
    } else {
        $addr = 'empt_param';
    }
}

if (array_key_exists('req_custmr', $_REQUEST)) {
    $custmr = urlencode($_REQUEST['req_custmr']);
    if (!strlen($custmr)) {
        $custmr = 'empt_param';
    }
} else {
    $custmr = 'empt_param';
}

// ------------------------------------------------------------
// Формируем URL с использованием конфига
// ------------------------------------------------------------
$url = $flaskUrl . '/' . $route . '/' . $addr . '/' . $custmr;

// проксируем во фласк-сервис
curl_setopt($ch, CURLOPT_URL, $url);

//return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// $output contains the output string
$output = curl_exec($ch);

// close curl resource to free up system resources
curl_close($ch);

echo $output;