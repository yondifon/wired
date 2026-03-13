import { registerPlaceholders } from './directives/placeholders'
import { registerEmailMask } from './directives/email-mask'
import { registerSlugLivewire } from './directives/slug-livewire'
import { registerSlugAlpine } from './directives/slug-alpine'

/**
 * Register all Wired directives
 *
 * Usage in app.js:
 *   import { Livewire, Alpine } from "../../vendor/livewire/livewire/dist/livewire.esm"
 *   import { registerDirectives } from '../../vendor/malico/wired/dist/index.js'
 *
 *   registerDirectives(Livewire, Alpine)
 *   Livewire.start()
 */
export function registerDirectives(Livewire: any, Alpine: any) {
    // Alpine directives
    registerPlaceholders(Alpine)
    registerEmailMask(Alpine)
    registerSlugAlpine(Alpine)

    // Livewire directives
    registerSlugLivewire(Livewire)
}

// Individual exports for selective registration
export { registerPlaceholders, registerEmailMask, registerSlugLivewire, registerSlugAlpine }
