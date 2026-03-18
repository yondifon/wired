export function registerCaseAlpine(Alpine: any) {
    Alpine.directive('case', (el: HTMLElement, { expression, modifiers }: any, { evaluate, cleanup }: any) => {
        const caseType = modifiers[0] ?? 'camel'
        const slugSeparator = modifiers[1] === 'underscore' ? '_' : '-'
        const inputEl = el as HTMLInputElement

        const splitWords = (text: string): string[] =>
            text
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
                .split(/[\s\-_./]+/)
                .filter(Boolean)

        const capitalize = (word: string): string =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

        const toSlug = (text: string): string => {
            const sep = slugSeparator
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, sep)
                .replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '')
                .replace(new RegExp(`${sep}{2,}`, 'g'), sep)
        }

        const toCase = (text: string): string => {
            const words = splitWords(text.toString().trim())

            switch (caseType) {
                case 'slug':     return toSlug(text)
                case 'camel':    return words.map((w, i) => i === 0 ? w.toLowerCase() : capitalize(w)).join('')
                case 'pascal':   return words.map(capitalize).join('')
                case 'snake':    return words.map(w => w.toLowerCase()).join('_')
                case 'constant': return words.map(w => w.toUpperCase()).join('_')
                case 'title':    return words.map(capitalize).join(' ')
                case 'dot':      return words.map(w => w.toLowerCase()).join('.')
                case 'kebab':    return words.map(w => w.toLowerCase()).join('-')
                case 'lower':    return text.toLowerCase().trim()
                case 'upper':    return text.toUpperCase().trim()
                default:         return text
            }
        }

        const sourceProperties = expression.trim().split(',').map((p: string) => p.trim())
        let lastExpectedValue = ''

        const getCurrentValue = () =>
            toCase(sourceProperties.map((p: string) => evaluate(p) as string).filter(Boolean).join(' '))

        const initialValue = getCurrentValue()
        if (!inputEl.value && initialValue) {
            lastExpectedValue = initialValue
            inputEl.value = lastExpectedValue
            inputEl.dispatchEvent(new Event('input', { bubbles: true }))
        }

        const $watch = evaluate('$watch') as Function
        const stopWatches = sourceProperties.map((prop: string) =>
            $watch(prop, () => {
                const shouldUpdate = !inputEl.value || inputEl.value === lastExpectedValue
                if (!shouldUpdate) return
                lastExpectedValue = getCurrentValue()
                inputEl.value = lastExpectedValue
                inputEl.dispatchEvent(new Event('input', { bubbles: true }))
            })
        )

        const handleManualInput = () => {
            const cursorPos = inputEl.selectionStart ?? 0
            const currentValue = inputEl.value
            const cased = toCase(currentValue)

            if (currentValue !== cased) {
                inputEl.value = cased
                const newPos = Math.min(cursorPos, cased.length)
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
