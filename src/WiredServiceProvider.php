<?php

namespace Malico\Wired;

use Illuminate\View\ComponentAttributeBag;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class WiredServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->bootViewMacros();
    }

    private function bootViewMacros(): void
    {
        /**
         * Extract attributes starting with a prefix and strip that prefix.
         * Usage: {{ $attributes->for('title') }}
         */
        ComponentAttributeBag::macro('for', function (string $prefix) {
            $separator = Str::finish($prefix, ':');
            $result = [];

            foreach ($this->attributes as $key => $value) {
                if (str_starts_with($key, $separator)) {
                    $newKey = substr($key, strlen($separator));
                    $result[$newKey] = $value;
                }
            }

            return new static($result);
        });
    }
}
