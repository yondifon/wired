const resolveInputElement = (el: HTMLElement): HTMLElement => {
    const tag = el.tagName?.toUpperCase()
    if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return el
    return el.querySelector('input, textarea, [contenteditable]') || el.parentElement?.querySelector('input, textarea, [contenteditable]') || el
}

const parsePlaceholders = (expression: string): string[] =>
    expression.split(',').map((p) => p.trim()).filter(Boolean)

export function registerEmailMask(Alpine: any) {
    Alpine.directive('email-mask', (el: HTMLElement, { expression }: any, { effect }: any) => {
        const allowedFields = new Set(parsePlaceholders(expression))
        const singleTokenPattern = /^\s*\{([\w]+)\}\s*$/
        const pairTokenPattern = /^\s*\{([\w]+)\}\s*<\s*\{([\w]+)\}\s*>\s*$/

        const inputEl = resolveInputElement(el) as HTMLInputElement

        const isAllowedField = (field: string): boolean => allowedFields.has(field)

        const normalizeEmail = (value: string): string | null => {
            const singleMatch = value.match(singleTokenPattern)
            if (singleMatch) {
                const emailField = singleMatch[1]
                if (!isAllowedField(emailField)) return null
                return `{${emailField}}`
            }

            const pairMatch = value.match(pairTokenPattern)
            if (!pairMatch) return null

            const displayNameField = pairMatch[1]
            const emailField = pairMatch[2]
            if (!isAllowedField(displayNameField) || !isAllowedField(emailField)) return null
            return `{${displayNameField}}<{${emailField}}>`
        }

        const validateValue = () => {
            const value = inputEl.value.trim()
            if (value === '') {
                inputEl.setCustomValidity('')
                return
            }

            const normalized = normalizeEmail(value)
            if (normalized !== null) {
                inputEl.setCustomValidity('')
                return
            }

            inputEl.setCustomValidity('Use {field} or {name}<{email}> format.')
        }

        const handleBlur = () => {
            const value = inputEl.value.trim()
            if (value === '') {
                inputEl.setCustomValidity('')
                return
            }

            const normalized = normalizeEmail(value)
            if (normalized === null) {
                validateValue()
                return
            }

            if (normalized !== inputEl.value) {
                inputEl.value = normalized
                inputEl.dispatchEvent(new Event('input', { bubbles: true }))
            }

            inputEl.setCustomValidity('')
        }

        const handleInput = () => validateValue()

        inputEl.addEventListener('input', handleInput)
        inputEl.addEventListener('blur', handleBlur)

        effect(() => {
            return () => {
                inputEl.removeEventListener('input', handleInput)
                inputEl.removeEventListener('blur', handleBlur)
            }
        })
    })
}
