import { mountPlaceholderMenu, resolveTokenStyle } from './placeholders'

export function registerPlaceholdersLivewire(Livewire: any) {
    Livewire.directive('placeholders', ({ el, directive, component, cleanup }: any) => {
        const property = directive.expression.trim()
        const style = resolveTokenStyle(directive.modifiers)

        const getPlaceholders = (): string[] => {
            const value = component.$wire.get(property)
            return Array.isArray(value) ? value : []
        }

        const destroyMenu = mountPlaceholderMenu(el, getPlaceholders, style)

        cleanup(destroyMenu)
    })
}
