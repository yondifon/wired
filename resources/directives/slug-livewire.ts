export function registerSlugLivewire(Livewire: any) {
    Livewire.directive('slug', ({ el, directive, cleanup }: any) => {
        const separator = directive.modifiers.length > 0 ? directive.modifiers[0] : '-'
        const sourceField = directive.expression.replace(/['"]/g, '').trim()

        const findSourceElement = (): HTMLInputElement | null =>
            document.querySelector(`[wire\\:model="${sourceField}"]`)

        const toSlug = (text: string): string =>
            text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, separator)
                .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')
                .replace(new RegExp(`${separator}{2,}`, 'g'), separator)

        const updateSlug = () => {
            const sourceEl = findSourceElement()
            if (!sourceEl) return

            const sourceValue = sourceEl.value
            const inputEl = el as HTMLInputElement
            const currentSlug = inputEl.value
            const expectedSlug = toSlug(sourceValue)

            if (!currentSlug || currentSlug === toSlug(sourceEl.dataset.lastSourceValue || '')) {
                inputEl.value = expectedSlug
                inputEl.dispatchEvent(new Event('input', { bubbles: true }))
            }

            sourceEl.dataset.lastSourceValue = sourceValue
        }

        const handleSourceInput = () => setTimeout(updateSlug, 0)

        const sourceEl = findSourceElement()
        if (sourceEl) {
            sourceEl.addEventListener('input', handleSourceInput)
            const inputEl = el as HTMLInputElement
            if (!inputEl.value && sourceEl.value) updateSlug()
        }

        const handleManualInput = () => {
            const inputEl = el as HTMLInputElement
            const cursorPos = inputEl.selectionStart ?? 0
            const currentValue = inputEl.value
            const slugified = toSlug(currentValue)

            if (currentValue !== slugified) {
                inputEl.value = slugified
                const newPos = Math.min(cursorPos, slugified.length)
                inputEl.setSelectionRange(newPos, newPos)
            }
        }

        const inputEl = el as HTMLInputElement
        inputEl.addEventListener('blur', handleManualInput)

        cleanup(() => {
            if (sourceEl) sourceEl.removeEventListener('input', handleSourceInput)
            inputEl.removeEventListener('blur', handleManualInput)
        })
    })
}
