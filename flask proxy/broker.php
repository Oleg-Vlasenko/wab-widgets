<?php
require_once __DIR__ . '/config_loader.php';

try {
    $config = ConfigLoader::load();
    $file_path = $config['exchangeFilePath'] ?? null;
    
    if (empty($file_path)) {
        throw new RuntimeException('Exchange file path is not configured');
    }
    
    if (!file_exists($file_path)) {
        throw new RuntimeException('Exchange file not found: ' . $file_path);
    }
    
    $file_content = file_get_contents($file_path);
    if ($file_content === false) {
        throw new RuntimeException('Failed to read exchange file');
    }
    
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    echo $file_content;
    
} catch (RuntimeException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}