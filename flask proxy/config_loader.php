<?php
// flask_proxy/config_loader.php

declare(strict_types=1);

class ConfigLoader {
    private static ?array $config = null;
    private static string $configFile = __DIR__ . '/widget_config.json';
    
    public static function load(): array {
        if (self::$config !== null) {
            return self::$config;
        }
        
        if (!file_exists(self::$configFile)) {
            throw new RuntimeException('Configuration file not found');
        }
        
        $content = file_get_contents(self::$configFile);
        if ($content === false) {
            throw new RuntimeException('Unable to read configuration file');
        }
        
        $config = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException('Invalid JSON: ' . json_last_error_msg());
        }
        
        self::$config = $config;
        return $config;
    }
}