export function registerAfterLivewire(Livewire: any, Alpine: any) {
    Livewire.directive('after', ({ el, directive, component, cleanup }: any) => {
        const actionName = directive.modifiers[0]
        if (!actionName) return

        const useFinish = directive.modifiers.includes('finish')
        const expression = directive.expression

        let removed = false

        component.$wire.intercept(actionName, ({ onSuccess, onFinish }: any) => {
            if (removed) return

            const hook = useFinish ? onFinish : onSuccess

            hook(() => {
                if (removed) return
                Alpine.evaluate(el, expression)
            })
        })

        cleanup(() => { removed = true })
    })
}
