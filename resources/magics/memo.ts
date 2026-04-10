export function registerMemo(Alpine: any) {
    Alpine.magic('memo', () => {
        let alias: string | undefined

        return Alpine.interceptor((initialValue: any, getter: () => any, setter: (v: any) => void, path: string) => {
            const key = alias || `_x_${path}`
            const stored = sessionStorage.getItem(key)
            setter(stored !== null ? JSON.parse(stored) : initialValue)

            Alpine.effect(() => {
                sessionStorage.setItem(key, JSON.stringify(getter()))
            })

            return initialValue
        }, (func: any) => {
            func.as = (k: string) => { alias = k; return func }
        })
    })
}
