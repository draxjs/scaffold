import {beforeEach, vi} from 'vitest'

beforeEach(() => {
  const items = new Map<string, string>()
  const storage: Storage = {
    get length() { return items.size },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => { items.delete(key) },
    setItem: (key, value) => { items.set(key, String(value)) },
  }
  vi.stubGlobal('localStorage', storage)
  // Exercise the single-tab fallback deterministically, without host Web Locks.
  vi.stubGlobal('navigator', {})
  vi.stubEnv('VITE_HTTP_TRANSPORT', 'REST')
  vi.stubEnv('VITE_DRAX_REMEMBER_ME_ENABLED', 'true')
})
