export type TokenStyle = {
    trigger: string
    close: string | null
    display: (name: string) => string
    insert: (name: string) => string
}

export const TOKEN_STYLES: Record<string, TokenStyle> = {
    default: { trigger: '{',  close: '}',  display: n => `{${n}}`,   insert: n => `{${n}}`   },
    double:  { trigger: '{{', close: '}}', display: n => `{{${n}}}`, insert: n => `{{${n}}}` },
    hash:    { trigger: '#',  close: null, display: n => `#${n}`,    insert: n => `#${n}`    },
    at:      { trigger: '@',  close: null, display: n => `@${n}`,    insert: n => `@${n}`    },
    dollar:  { trigger: '${', close: '}',  display: n => `\${${n}}`, insert: n => `\${${n}}` },
    percent: { trigger: '%',  close: '%',  display: n => `%${n}%`,   insert: n => `%${n}%`   },
}

export const resolveTokenStyle = (modifiers: string[]): TokenStyle => {
    for (const key of Object.keys(TOKEN_STYLES)) {
        if (modifiers.includes(key)) return TOKEN_STYLES[key]
    }
    return TOKEN_STYLES.default
}

const resolveInputElement = (el: HTMLElement): HTMLElement => {
    const tag = el.tagName?.toUpperCase()

    if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return el

    return (
        el.querySelector('input, textarea, [contenteditable]') ||
        el.parentElement?.querySelector('input, textarea, [contenteditable]') ||
        el
    )
}

export function mountPlaceholderMenu(
    el: HTMLElement,
    getPlaceholders: () => string[],
    style: TokenStyle,
): () => void {
    let menuEl: HTMLDivElement | null = null
    let isOpen = false
    let searchText = ''

    const getInputEl = () =>
        resolveInputElement(el) as HTMLInputElement | HTMLTextAreaElement

    const getNativeValue = (input: HTMLTextAreaElement): string => {
        const descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')
        return descriptor?.get?.call(input) ?? ''
    }

    const setNativeValue = (input: HTMLTextAreaElement, value: string) => {
        const descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')
        descriptor?.set?.call(input, value)
    }

    const getValue = (): string => {
        const input = getInputEl()
        const tag = input.tagName?.toUpperCase()

        if (tag === 'TEXTAREA') return getNativeValue(input as HTMLTextAreaElement)

        return input.isContentEditable
            ? input.innerText
            : (input as HTMLInputElement).value
    }

    const setValue = (value: string) => {
        const input = getInputEl()
        const tag = input.tagName?.toUpperCase()

        if (tag === 'TEXTAREA') {
            setNativeValue(input as HTMLTextAreaElement, value)
        } else if (input.isContentEditable) {
            input.innerText = value
        } else {
            (input as HTMLInputElement).value = value
        }
    }

    const getCursorPosition = (): number =>
        (getInputEl() as HTMLInputElement).selectionStart ?? 0

    const setCursorPosition = (position: number) => {
        const input = getInputEl() as HTMLInputElement
        input.setSelectionRange?.(position, position)
    }

    const getMatchingItems = (): string[] => {
        const placeholders = getPlaceholders()
        if (!searchText) return placeholders
        return placeholders.filter(p => p.toLowerCase().includes(searchText.toLowerCase()))
    }

    const showMenu = () => { if (menuEl) menuEl.style.display = 'block' }
    const hideMenu = () => { if (menuEl) menuEl.style.display = 'none' }

    const buildMenu = () => {
        if (!menuEl) return
        menuEl.innerHTML = ''
        const items = getMatchingItems()

        if (!items.length) {
            hideMenu()
            return
        }

        items.forEach(name => {
            const item = document.createElement('div')
            item.textContent = style.display(name)
            item.className = 'px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700'
            item.addEventListener('mousedown', e => {
                e.preventDefault()
                insertPlaceholder(name)
            })
            menuEl!.appendChild(item)
        })

        showMenu()
    }

    const closeMenu = () => {
        isOpen = false
        searchText = ''
        hideMenu()
    }

    const openMenu = () => {
        isOpen = true
        buildMenu()
    }

    const updateMenuState = () => {
        const value = getValue()
        const cursorPos = getCursorPosition()
        const textBeforeCursor = value.slice(0, cursorPos)
        const triggerPos = textBeforeCursor.lastIndexOf(style.trigger)

        if (triggerPos === -1) {
            closeMenu()
            return
        }

        const textAfterTrigger = textBeforeCursor.slice(triggerPos + style.trigger.length)

        if (style.close) {
            if (textAfterTrigger.includes(style.close[0])) {
                closeMenu()
                return
            }
        } else if (/\s/.test(textAfterTrigger)) {
            closeMenu()
            return
        }

        searchText = textAfterTrigger
        openMenu()
    }

    const insertPlaceholder = (name: string) => {
        const input = getInputEl() as HTMLInputElement
        const cursorPos = input.selectionStart ?? 0
        const value = getValue()
        const textBeforeCursor = value.slice(0, cursorPos)
        const triggerPos = textBeforeCursor.lastIndexOf(style.trigger)

        if (triggerPos === -1) return

        const before = value.slice(0, triggerPos)
        const after = value.slice(cursorPos)
        const inserted = style.insert(name)

        setValue(`${before}${inserted}${after}`)
        setCursorPosition(before.length + inserted.length)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        closeMenu()
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (isOpen && e.key === 'Escape') {
            e.preventDefault()
            closeMenu()
        }
    }

    const handleInput = () => updateMenuState()
    const handleClick = () => updateMenuState()
    const handleBlur = () => closeMenu()

    menuEl = document.createElement('div')
    menuEl.className = 'absolute z-50 mt-1 border bg-white dark:bg-zinc-800 text-sm shadow w-40'
    menuEl.style.display = 'none'

    const input = getInputEl()
    input.parentElement!.style.position = 'relative'
    input.parentElement!.appendChild(menuEl)

    input.addEventListener('input', handleInput)
    input.addEventListener('click', handleClick)
    input.addEventListener('keydown', handleKeydown)
    input.addEventListener('blur', handleBlur)

    return () => {
        input.removeEventListener('input', handleInput)
        input.removeEventListener('click', handleClick)
        input.removeEventListener('keydown', handleKeydown)
        input.removeEventListener('blur', handleBlur)
        menuEl?.remove()
    }
}

export function registerPlaceholders(Alpine: any) {
    Alpine.directive(
        'placeholders',
        (el: HTMLElement, { expression, modifiers }: any, { effect, evaluate }: any) => {
            const style = resolveTokenStyle(modifiers)

            const getPlaceholders = (): string[] => {
                try {
                    const evaluated = evaluate(expression)
                    if (Array.isArray(evaluated)) return evaluated
                } catch {}
                return expression.split(',').map((p: string) => p.trim()).filter(Boolean)
            }

            const cleanup = mountPlaceholderMenu(el, getPlaceholders, style)
            effect(() => cleanup)
        },
    )
}
