class IDBStorage {
    private storeName = 'keyvaluepairs'
    private dbPromise: Promise<IDBDatabase>

    constructor(dbName: string) {
        this.dbPromise = new Promise(resolve => {
            const req = indexedDB.open(dbName, 1)
            req.onupgradeneeded = () => req.result.createObjectStore(this.storeName)
            req.onsuccess = () => resolve(req.result)
        })
    }

    async get(key: string): Promise<any> {
        const db = await this.dbPromise
        return new Promise(resolve => {
            const req = db.transaction(this.storeName).objectStore(this.storeName).get(key)
            req.onsuccess = () => resolve(req.result)
        })
    }

    async set(key: string, value: any): Promise<void> {
        const db = await this.dbPromise
        db.transaction(this.storeName, 'readwrite').objectStore(this.storeName).put(value, key)
    }
}

export function registerVault(Alpine: any) {
    const idb = new IDBStorage('AlpineVault')

    Alpine.magic('vault', () => {
        let alias: string | undefined

        return Alpine.interceptor((initialValue: any, getter: () => any, setter: (v: any) => void, path: string) => {
            const key = alias || `_x_${path}`

            idb.get(key).then(value => {
                if (value !== undefined && value !== null) setter(value)
            })

            Alpine.effect(() => {
                idb.set(key, getter())
            })

            return initialValue
        }, (func: any) => {
            func.as = (k: string) => { alias = k; return func }
        })
    })
}
