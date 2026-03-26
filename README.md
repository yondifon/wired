# Wired

Alpine and Livewire directives for common input behaviors — slugs, case transforms, email masks, placeholders, and action callbacks.

## Installation

```bash
composer require malico/wired
```

Register in `resources/js/app.js`:

```js
import { Livewire, Alpine } from "../../vendor/livewire/livewire/dist/livewire.esm"
import { registerDirectives } from '../../vendor/malico/wired/dist/index.js'

registerDirectives(Livewire, Alpine)

Livewire.start()
```

Or register individually:

```js
import { registerSlugAlpine, registerCaseAlpine } from '../../vendor/malico/wired/dist/index.js'

registerSlugAlpine(Alpine)
registerCaseAlpine(Alpine)
```

---

## Directives

### `x-slug` / `wire:slug`

Watches a source property and auto-generates a URL-safe slug. Updates reactively. Stops updating if the user manually edits the field.

**Default separator: `-`**

```html
<!-- Alpine -->
<input x-data="{ title: '' }" x-model="title" placeholder="Title">
<input x-data="{ title: '', slug: '' }" x-model="slug" x-slug="title">

<!-- Livewire -->
<input wire:model="title" placeholder="Title">
<input wire:model="slug" wire:slug="title">
```

**Underscore separator:**

```html
<input x-slug.underscore="title">
<input wire:slug.underscore="title">
```

**Multiple sources** — values are joined with a space before slugifying:

```html
<!-- "Hello World" + "42" → hello-world-42 -->
<input x-slug="title, id">
<input wire:slug="title, id">

<input x-slug.underscore="title, id">   <!-- hello_world_42 -->
```

**On blur**, the field normalizes whatever the user typed into a valid slug.

---

### `x-case` / `wire:case`

Watches a source property and transforms it into a specific case format. Same reactive behavior as `x-slug`.

#### Modifiers

| Modifier | Input | Output |
|----------|-------|--------|
| `camel` | `hello world` | `helloWorld` |
| `pascal` | `hello world` | `HelloWorld` |
| `snake` | `hello world` | `hello_world` |
| `constant` | `hello world` | `HELLO_WORLD` |
| `title` | `hello world` | `Hello World` |
| `dot` | `hello world` | `hello.world` |
| `kebab` | `hello world` | `hello-world` |
| `lower` | `Hello World` | `hello world` |
| `upper` | `Hello World` | `HELLO WORLD` |
| `slug` | `Hello World!` | `hello-world` |
| `slug.underscore` | `Hello World!` | `hello_world` |

```html
<!-- Alpine -->
<input x-case.camel="title">
<input x-case.pascal="title">
<input x-case.snake="title">
<input x-case.constant="title">
<input x-case.slug="title">
<input x-case.slug.underscore="title">

<!-- Livewire -->
<input wire:case.camel="title">
<input wire:case.pascal="title">
<input wire:case.snake="title">
<input wire:case.constant="title">
<input wire:case.slug="title">
<input wire:case.slug.underscore="title">
```

**Multiple sources:**

```html
<!-- "john" + "doe" → johnDoe -->
<input x-case.camel="firstName, lastName">

<!-- "john" + "doe" → JohnDoe -->
<input wire:case.pascal="firstName, lastName">

<!-- "My Post" + "42" → my-post-42 -->
<input x-case.slug="title, id">
```

**Full Alpine example:**

```html
<div x-data="{ firstName: '', lastName: '', handle: '' }">
    <input x-model="firstName" placeholder="First name">
    <input x-model="lastName" placeholder="Last name">
    <input x-model="handle" x-case.camel="firstName, lastName" placeholder="Handle">
</div>
```

**Full Livewire example:**

```php
// In your Livewire component
public string $title = '';
public string $slug = '';
public string $className = '';
```

```html
<input wire:model="title" placeholder="Title">
<input wire:model="slug" wire:case.slug="title">
<input wire:model="className" wire:case.pascal="title">
```

---

### `x-placeholders`

Autocomplete for `{token}` placeholders inside a textarea. Type `{` to trigger. `ESC` to dismiss.

```html
<textarea x-placeholders="name, email, company"></textarea>
```

---

### `x-email-mask`

Validates email input against two formats: a plain address (`user@example.com`) or a named address (`Name <user@example.com>`).

```html
<input x-email-mask="name, email">
```

---

### `wire:after`

Runs a JS expression after a Livewire action completes. Useful for closing modals, resetting UI state, or dispatching events after form submissions.

The expression evaluates in Alpine scope, so `$flux`, `$dispatch`, `$refs`, etc. all work.

**Inferred action** — when the element also has `wire:click` or `wire:submit`, the action name is picked up automatically:

```html
<button wire:click="saveSettings" wire:after="$dispatch('saved')">Save</button>

<form wire:submit="save" wire:after="open = false">
```

**Explicit action name** — pass the action name as the first argument when you need to be specific:

```html
<button wire:after="saveSettings, $dispatch('saved')">Save</button>
```

This also handles actions with arguments in the expression:

```html
<button wire:after="save, $dispatch('post-created', { id: postId })">Save</button>
```

**`.finish` modifier** — by default the expression runs on `onSuccess` (after the server responds, before DOM morph). Add `.finish` to run after the DOM has fully updated:

```html
<form wire:submit="save" wire:after.finish="$flux.modal('confirm').close()">
```

**Confirmation modal example:**

```blade
<flux:button
    type="submit"
    variant="danger"
    wire:after="$flux.modal('confirm').close()"
>{{ __('Confirm') }}</flux:button>
```

---

## PHP Macros

### `$attributes->for(prefix)`

Passes scoped attributes from a parent to specific elements inside a child component. Any attribute prefixed with `title:` becomes a plain attribute on the element that calls `$attributes->for('title')`.

**Child component** — `resources/views/components/card.blade.php`:

```blade
<div class="card">
    <h2 {{ $attributes->for('title') }}>{{ $title }}</h2>
    <p {{ $attributes->for('description') }}>{{ $description }}</p>
</div>
```

**Parent usage:**

```blade
<x-card
    title="Getting Started"
    description="Everything you need to know."
    title:class="text-xl font-bold text-gray-900"
    description:class="text-sm text-gray-500"
/>
```

**Rendered output:**

```html
<div class="card">
    <h2 class="text-xl font-bold text-gray-900">Getting Started</h2>
    <p class="text-sm text-gray-500">Everything you need to know.</p>
</div>
```

Any attribute works — not just `class`:

```blade
<x-card
    title:class="font-bold"
    title:id="section-title"
    title:data-track="heading"
    description:class="text-sm"
    description:hidden="true"
/>
```

```blade
{{-- child receives each attribute stripped of its prefix --}}
<h2 {{ $attributes->for('title') }}>
{{-- renders: <h2 class="font-bold" id="section-title" data-track="heading"> --}}

<p {{ $attributes->for('description') }}>
{{-- renders: <p class="text-sm" hidden="true"> --}}
```

---

## Development

```bash
bun run build   # build once
bun run watch   # rebuild on change
```
