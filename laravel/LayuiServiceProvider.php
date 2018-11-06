<?php

namespace Layui;

use Illuminate\Support\ServiceProvider;

/**
 * Layui的laravel服务包
 */
class LayuiServiceProvider extends ServiceProvider
{
    /**
     * 发布Layui的`dist`到public目录下
     *
     * @return void
     */
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/../dist/' => public_path('vendor/layui/'),
        ], 'layui');
    }
}
