import { registerPlaceholders } from './directives/placeholders'
import { registerEmailMask } from './directives/email-mask'
import { registerSlugAlpine } from './directives/slug-alpine'
import { registerSlugLivewire } from './directives/slug-livewire'
import { registerCaseAlpine } from './directives/case-alpine'
import { registerCaseLivewire } from './directives/case-livewire'

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
    registerCaseAlpine(Alpine)

    // Livewire directives
    registerSlugLivewire(Livewire)
    registerCaseLivewire(Livewire)
}

// Individual exports for selective registration
export { registerPlaceholders, registerEmailMask, registerSlugAlpine, registerSlugLivewire, registerCaseAlpine, registerCaseLivewire }
