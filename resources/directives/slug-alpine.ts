export function registerSlugAlpine(Alpine: any) {
    Alpine.directive('slug', (el: HTMLElement, { expression }: any, { effect }: any) => {
        const separator = expression && expression.trim() ? expression.trim() : '-'

        const toSlug = (text: string): string =>
            text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, separator)
                .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')
                .replace(new RegExp(`${separator}{2,}`, 'g'), separator)

        const handleInput = () => {
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
        inputEl.addEventListener('input', handleInput)

        effect(() => {
            return () => {
                inputEl.removeEventListener('input', handleInput)
            }
        })
    })
}
