export function registerSlugAlpine(Alpine: any) {
    Alpine.directive('slug', (el: HTMLElement, { expression, modifiers }: any, { evaluate, cleanup }: any) => {
        const separator = modifiers[0] ?? '-'
        const inputEl = el as HTMLInputElement

        const toSlug = (text: string): string =>
            text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, separator)
                .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')
                .replace(new RegExp(`${separator}{2,}`, 'g'), separator)

        const sourceProperties = expression.trim().split(',').map((p: string) => p.trim())
        let lastExpectedSlug = ''

        const getCurrentSlug = () =>
            toSlug(sourceProperties.map((p: string) => evaluate(p) as string).filter(Boolean).join(' '))

        const initialSlug = getCurrentSlug()
        if (!inputEl.value && initialSlug) {
            lastExpectedSlug = initialSlug
            inputEl.value = lastExpectedSlug
            inputEl.dispatchEvent(new Event('input', { bubbles: true }))
        }

        const $watch = evaluate('$watch') as Function
        const stopWatches = sourceProperties.map((prop: string) =>
            $watch(prop, () => {
                const shouldUpdate = !inputEl.value || inputEl.value === lastExpectedSlug
                if (!shouldUpdate) return
                lastExpectedSlug = getCurrentSlug()
                inputEl.value = lastExpectedSlug
                inputEl.dispatchEvent(new Event('input', { bubbles: true }))
            })
        )

        const handleManualInput = () => {
            const cursorPos = inputEl.selectionStart ?? 0
            const currentValue = inputEl.value
            const slugified = toSlug(currentValue)

            if (currentValue !== slugified) {
                inputEl.value = slugified
                const newPos = Math.min(cursorPos, slugified.length)
                inputEl.setSelectionRange(newPos, newPos)
            }
        }

        inputEl.addEventListener('blur', handleManualInput)

        cleanup(() => {
            stopWatches.forEach((stop: Function) => stop())
            inputEl.removeEventListener('blur', handleManualInput)
        })
    })
}
