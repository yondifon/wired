# Wired

Livewire utilities and macros for streamlined component development.

## Installation

Add to `composer.json`:

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../tinkerbin/wired"
    }
  ],
  "require": {
    "malico/wired": "dev-main"
  }
}
```

Then install:

```bash
composer install
```

The PHP service provider auto-registers.

## Usage

Update your `resources/js/app.js`:

```javascript
import {
    Livewire,
    Alpine,
} from "../../vendor/livewire/livewire/dist/livewire.esm"
import { registerDirectives } from '../../vendor/malico/wired/dist/index.js'

// Register all wired directives
registerDirectives(Livewire, Alpine)

// Your custom setup
Alpine.magic("paymentPhoneNumber", () => () => {
    return "+237 999 999 999"
})

Livewire.start()
```

## Available Directives

### Alpine

#### `x-placeholders`
Autocomplete for placeholder tokens `{field}`.

```blade
<textarea x-placeholders="name, email, company"></textarea>
```

Type `{` to autocomplete. ESC to close.

#### `x-email-mask`
Validates email format: `{field}` or `{name}<{email}>`.

```blade
<input x-email-mask="name, email">
```

#### `x-slug`
Auto-formats to URL-safe slugs.

```blade
<input x-slug>
<input x-slug="_">
```

### Livewire

#### `wire:slug`
Auto-generates slug from another field.

```blade
<input wire:model="name" />
<input wire:model="slug" wire:slug="name" />
```

## PHP Macros

### `$attributes->for(prefix)`

Extract prefixed attributes.

```blade
<!-- Usage -->
{{ $attributes->for('title') }}
{{ $attributes->for('description') }}
```

## Development

**Build:**
```bash
bun run build
```

**Watch:**
```bash
bun run watch
```
