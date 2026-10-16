import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {createMemoryHistory, createRouter} from 'vue-router'
import {HttpClientFactory, HttpRestClientFactory} from '@drax/common-front'
import {useAuth, useAuthStore, refreshAuthSession} from '@drax/identity-vue'
import type {IAuthFullUser} from '@drax/identity-front'
import {authGuard} from '../src/router/auth-guard'
import {setupAuth} from '../src/setup/SetupAuth'

const {routerPush} = vi.hoisted(() => ({routerPush: vi.fn()}))

// Keep the authentication composable real; only its component-only router access
// is replaced because these tests execute the guard without mounting a component.
vi.mock('vue-router', async (importOriginal) => ({
  ...await importOriginal<typeof import('vue-router')>(),
  useRouter: () => ({push: routerPush}),
}))

const now = new Date('2030-01-01T12:00:00Z')
const jwt = (expiresInSeconds: number) => {
  const payload = Buffer.from(JSON.stringify({sub: 'test-user', exp: now.getTime() / 1000 + expiresInSeconds})).toString('base64url')
  return `eyJhbGciOiJub25lIn0.${payload}.test-signature`
}
const expired = jwt(-60)
const fresh = jwt(3600)
const refreshExpiresAt = '2030-02-01T12:00:00Z'
const profile: IAuthFullUser = {
  id: 'test-user', username: 'test-user', email: 'user@example.invalid',
  active: true, name: 'Test User', phone: '', avatar: '',
  role: {_id: 'test-role', id: 'test-role', name: 'Reader', readonly: false, permissions: ['document:read']},
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: {'content-type': 'application/json'},
})
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return {promise, resolve}
}

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {path: '/login', name: 'Login', component: {}, meta: {auth: true}},
    {path: '/public', component: {}},
    {path: '/private', component: {}, meta: {auth: true}},
    {path: '/read', component: {}, meta: {permission: 'document:read'}},
    {path: '/write', component: {}, meta: {auth: true, permission: 'document:write'}},
  ],
})
function normalizedRoute(path: string) {
  const route = router.resolve(path)
  return {...route, name: route.name ?? undefined}
}
const navigate = (path: string) => authGuard(normalizedRoute(path), normalizedRoute('/public'), vi.fn())
const loginRedirect = (path: string) => ({path: '/login', query: {redirect: path}})

let store: ReturnType<typeof useAuthStore>
let client: ReturnType<typeof HttpRestClientFactory.getInstance>
let network: ReturnType<typeof vi.fn<typeof fetch>>

function remember(accessToken = expired, withProfile = false) {
  store.setSession({accessToken, refreshToken: 'synthetic-refresh', refreshExpiresAt})
  if (withProfile) store.setAuthUser(structuredClone(profile))
}
function refreshed() {
  return json({accessToken: fresh, refreshToken: 'synthetic-rotated', refreshExpiresAt})
}
function callsTo(path: string) {
  return network.mock.calls.filter(([url]) => url === path)
}
function authorization(options?: RequestInit) {
  return new Headers(options?.headers).get('Authorization')
}
function sessionIsCleared() {
  // Boolean assertions avoid dumping credentials if a regression occurs.
  expect(store.accessToken === null).toBe(true)
  expect(store.refreshToken === null).toBe(true)
  expect(store.refreshExpiresAt === null).toBe(true)
  expect(store.authUser === null).toBe(true)
  expect(client.getHeaderValue('Authorization') === '').toBe(true)
  const persisted = JSON.parse(localStorage.getItem('AuthStore')!)
  expect(persisted.accessToken === null && persisted.refreshToken === null && persisted.authUser === null).toBe(true)
}

beforeEach(async () => {
  vi.useFakeTimers({toFake: ['Date']})
  vi.setSystemTime(now)
  setActivePinia(createPinia())
  store = useAuthStore()
  client = HttpRestClientFactory.getInstance()
  client.removeHeader('Authorization')
  network = vi.fn<typeof fetch>(async () => { throw new Error('Unexpected network request') })
  vi.stubGlobal('fetch', network)
  // Drax logs HTTP failures. Suppress those here to prevent headers/body from
  // leaking through error objects; assertions below verify the failure behavior.
  vi.spyOn(console, 'error').mockImplementation(() => {})
  // Rebind the shared singleton preflight to this test's real store.
  await setupAuth()
})
afterEach(() => { vi.useRealTimers() })

describe('auth guard with real Drax authentication', () => {
  it.each([undefined, 'false'])('flag %s: a legacy refresh token does not prevent redirect', async (flag) => {
    vi.stubEnv('VITE_DRAX_REMEMBER_ME_ENABLED', flag)
    remember()
    expect(await navigate('/private?tab=details')).toEqual(loginRedirect('/private?tab=details'))
    expect(network).not.toHaveBeenCalled()
  })

  it('keeps public routes and Login accessible without a session', async () => {
    expect(await navigate('/public')).toBeUndefined()
    expect(await navigate('/login')).toBeUndefined()
    expect(network).not.toHaveBeenCalled()
  })

  it('preserves permission checks, including routes with permission but no auth flag', async () => {
    store.setAccessToken(fresh)
    store.setAuthUser(structuredClone(profile))
    expect(await navigate('/private')).toBeUndefined()
    expect(await navigate('/read')).toBeUndefined()
    expect(await navigate('/write')).toEqual(loginRedirect('/write'))
    store.clearAuth()
    expect(await navigate('/read')).toEqual(loginRedirect('/read'))
    expect(network).not.toHaveBeenCalled()
  })

  it('waits for refresh AND the current profile before allowing navigation', async () => {
    remember()
    const rotation = deferred<Response>()
    const me = deferred<Response>()
    network.mockImplementation(async (url) => {
      if (url === '/api/auth/refresh') return rotation.promise
      if (url === '/api/auth/me') return me.promise
      throw new Error('Unexpected network request')
    })
    let settled = false
    const navigation = Promise.resolve(navigate('/read')).then((result) => { settled = true; return result })
    await vi.waitFor(() => expect(callsTo('/api/auth/refresh')).toHaveLength(1))
    expect(settled).toBe(false)
    rotation.resolve(refreshed())
    await vi.waitFor(() => expect(callsTo('/api/auth/me')).toHaveLength(1))
    expect(settled).toBe(false)
    me.resolve(json(profile))
    expect(await navigation).toBeUndefined()
    expect(store.accessToken === fresh && store.refreshToken === 'synthetic-rotated').toBe(true)
    expect(store.authUser?.id).toBe(profile.id)
  })

  it('cancels protected navigation offline without destroying the recoverable session', async () => {
    remember(expired, true)
    network.mockRejectedValue(new TypeError('Offline'))
    expect(await navigate('/private')).toBe(false)
    expect(store.accessToken === expired && store.refreshToken === 'synthetic-refresh').toBe(true)
    expect(store.authUser?.id).toBe(profile.id)
    expect(useAuth().isAuthenticated()).toBe(false)
  })

  it('does not authorize by a fresh token alone; retries missing profile without another rotation', async () => {
    remember(fresh)
    network.mockRejectedValueOnce(new TypeError('Offline')).mockResolvedValueOnce(json(profile))
    expect(await navigate('/private')).toBe(false)
    expect(store.authUser).toBeNull()
    expect(useAuth().isAuthenticated()).toBe(false)
    expect(store.refreshToken === 'synthetic-refresh').toBe(true)
    expect(await navigate('/private')).toBeUndefined()
    expect(callsTo('/api/auth/refresh')).toHaveLength(0)
    expect(callsTo('/api/auth/me')).toHaveLength(2)
  })

  it('redirects rather than cancels when no recoverable session exists', async () => {
    store.setAccessToken(expired)
    expect(await navigate('/private')).toEqual(loginRedirect('/private'))
    expect(network).not.toHaveBeenCalled()
  })

  it.each([401, 403])('refresh rejected with %s clears memory, persistence and headers', async (status) => {
    remember(expired, true)
    network.mockResolvedValue(json({message: 'Rejected'}, status))
    expect(await navigate('/private')).toEqual(loginRedirect('/private'))
    sessionIsCleared()
    expect(callsTo('/api/auth/refresh')).toHaveLength(1)
    expect(callsTo('/api/auth/me')).toHaveLength(0)
  })

  it('a rejected /me clears the newly rotated session too', async () => {
    remember()
    network.mockResolvedValueOnce(refreshed()).mockResolvedValueOnce(json({message: 'Rejected'}, 401))
    expect(await navigate('/private')).toEqual(loginRedirect('/private'))
    sessionIsCleared()
  })
})

describe('login and logout with real Drax authentication', () => {
  it.each([undefined, false])('login with rememberMe=%s keeps an ordinary session without refresh', async (rememberMe) => {
    // A previous remembered session must not leak into an ordinary login.
    remember(expired, true)
    network.mockResolvedValueOnce(json({accessToken: fresh})).mockResolvedValueOnce(json(profile))
    await useAuth().login('test-user', 'synthetic-password', rememberMe)

    const loginCalls = callsTo('/api/auth/login')
    expect(loginCalls.length).toBe(1)
    const body = JSON.parse(String(loginCalls[0]?.[1]?.body))
    expect(Object.hasOwn(body, 'rememberMe')).toBe(false)
    expect(store.accessToken === fresh).toBe(true)
    expect(store.refreshToken === null && store.refreshExpiresAt === null).toBe(true)
    expect(useAuth().isAuthenticated()).toBe(true)
    const persisted = JSON.parse(localStorage.getItem('AuthStore')!)
    expect(persisted.accessToken === fresh && persisted.refreshToken === null && persisted.refreshExpiresAt === null).toBe(true)
    expect(persisted.authUser?.id).toBe(profile.id)
    expect(authorization(callsTo('/api/auth/me')[0]?.[1]) === `Bearer ${fresh}`).toBe(true)

    vi.setSystemTime(new Date(now.getTime() + 3601_000))
    expect(await navigate('/private')).toEqual(loginRedirect('/private'))
    expect(callsTo('/api/auth/refresh').length).toBe(0)
    expect(network.mock.calls.length).toBe(2)
  })

  it('opt-in login sends rememberMe true and persists the extended session and profile', async () => {
    network.mockImplementation(async (url) => {
      if (url === '/api/auth/login') return refreshed()
      // The real preflight can hydrate the missing profile before the login's
      // own /me request continues, so serve each request independently.
      if (url === '/api/auth/me') return json(profile)
      throw new Error('Unexpected network request')
    })
    await useAuth().login('test-user', 'synthetic-password', true)

    const loginCalls = callsTo('/api/auth/login')
    expect(loginCalls.length).toBe(1)
    const body = JSON.parse(String(loginCalls[0]?.[1]?.body))
    expect(body.rememberMe === true).toBe(true)
    expect(store.accessToken === fresh && store.refreshToken === 'synthetic-rotated').toBe(true)
    expect(store.refreshExpiresAt === refreshExpiresAt).toBe(true)
    const persisted = JSON.parse(localStorage.getItem('AuthStore')!)
    expect(persisted.accessToken === fresh && persisted.refreshToken === 'synthetic-rotated' && persisted.refreshExpiresAt === refreshExpiresAt).toBe(true)
    expect(persisted.authUser?.id).toBe(profile.id)
    expect(useAuth().isAuthenticated()).toBe(true)
    expect(authorization(callsTo('/api/auth/me')[0]?.[1]) === `Bearer ${fresh}`).toBe(true)
    expect(callsTo('/api/auth/me').length).toBeGreaterThanOrEqual(1)
    expect(callsTo('/api/auth/refresh').length).toBe(0)
  })

  it('flag false ignores opt-in and discards even an extended login response', async () => {
    vi.stubEnv('VITE_DRAX_REMEMBER_ME_ENABLED', 'false')
    network.mockResolvedValueOnce(refreshed()).mockResolvedValueOnce(json(profile))
    await useAuth().login('test-user', 'synthetic-password', true)

    const loginCalls = callsTo('/api/auth/login')
    expect(loginCalls.length).toBe(1)
    const body = JSON.parse(String(loginCalls[0]?.[1]?.body))
    expect(Object.hasOwn(body, 'rememberMe')).toBe(false)
    expect(store.accessToken === fresh).toBe(true)
    expect(store.refreshToken === null && store.refreshExpiresAt === null).toBe(true)
    const persisted = JSON.parse(localStorage.getItem('AuthStore')!)
    expect(persisted.refreshToken === null && persisted.refreshExpiresAt === null).toBe(true)
    expect(useAuth().isAuthenticated()).toBe(true)
    expect(callsTo('/api/auth/refresh').length).toBe(0)
    expect(network.mock.calls.length).toBe(2)
  })

  it.each([false, true])('logout clears immediately and attempts revocation even when offline=%s', async (offline) => {
    remember(expired, true)
    client.addHeader('Authorization', `Bearer ${expired}`)
    const revocation = deferred<Response>()
    network.mockImplementation(async () => {
      const response = await revocation.promise
      if (offline) throw new TypeError('Offline')
      return response
    })

    const logout = useAuth().logout()
    sessionIsCleared()
    expect(useAuth().isAuthenticated()).toBe(false)
    expect(routerPush).toHaveBeenCalledWith({name: 'Login'})
    await vi.waitFor(() => expect(callsTo('/api/auth/logout').length).toBe(1))
    const options = callsTo('/api/auth/logout')[0]?.[1]
    expect(options?.method).toBe('POST')
    expect(JSON.parse(String(options?.body)).refreshToken === 'synthetic-refresh').toBe(true)
    expect(authorization(options) === null).toBe(true)
    revocation.resolve(json({success: true}))
    await expect(logout).resolves.toBeUndefined()
    sessionIsCleared()
    expect(callsTo('/api/auth/refresh').length).toBe(0)
    expect(network.mock.calls.length).toBe(1)
  })

  it('a refresh response arriving after logout cannot restore the session and is revoked', async () => {
    remember(expired, true)
    const rotation = deferred<Response>()
    network.mockImplementation(async (url) => {
      if (url === '/api/auth/refresh') return rotation.promise
      if (url === '/api/auth/logout') return json({success: true})
      throw new Error('Unexpected network request')
    })
    const refresh = refreshAuthSession()
    await vi.waitFor(() => expect(callsTo('/api/auth/refresh').length).toBe(1))
    await useAuth().logout()
    sessionIsCleared()

    rotation.resolve(refreshed())
    await refresh
    sessionIsCleared()
    expect(useAuth().isAuthenticated()).toBe(false)
    expect(callsTo('/api/auth/me').length).toBe(0)
    const revocations = callsTo('/api/auth/logout')
    expect(revocations.length).toBe(2)
    expect(JSON.parse(String(revocations[0]?.[1]?.body)).refreshToken === 'synthetic-refresh').toBe(true)
    expect(JSON.parse(String(revocations[1]?.[1]?.body)).refreshToken === 'synthetic-rotated').toBe(true)
    expect(revocations.every(([, options]) => authorization(options) === null)).toBe(true)
  })
})

describe('setup and shared REST preflight', () => {
  it('SetupAuth restores a persisted expired session and fetches /me without deadlock', async () => {
    localStorage.setItem('AuthStore', JSON.stringify({
      accessToken: expired, refreshToken: 'synthetic-refresh', refreshExpiresAt, authUser: null,
    }))
    network.mockResolvedValueOnce(refreshed()).mockResolvedValueOnce(json(profile))
    await setupAuth()
    expect(network.mock.calls.map(([url]) => url)).toEqual(['/api/auth/refresh', '/api/auth/me'])
    expect(useAuth().isAuthenticated()).toBe(true)
    expect(store.authUser?.id).toBe(profile.id)
    expect(authorization(callsTo('/api/auth/refresh')[0]?.[1]) === null).toBe(true)
    expect(authorization(callsTo('/api/auth/me')[0]?.[1]) === `Bearer ${fresh}`).toBe(true)
  })

  it('concurrent GET/POST and guard share one refresh and snapshot fresh headers after it', async () => {
    remember()
    const rotation = deferred<Response>()
    network.mockImplementation(async (url) => {
      if (url === '/api/auth/refresh') return rotation.promise
      if (url === '/api/auth/me') return json(profile)
      if (url === '/api/documents' || url === '/api/reports') return json({ok: true})
      throw new Error('Unexpected network request')
    })
    const requests = Promise.all([
      client.get('/api/documents'), client.post('/api/reports', {page: 1}),
      client.get('/api/documents'), navigate('/read'), refreshAuthSession(),
    ])
    await vi.waitFor(() => expect(callsTo('/api/auth/refresh')).toHaveLength(1))
    expect(callsTo('/api/documents')).toHaveLength(0)
    expect(callsTo('/api/reports')).toHaveLength(0)
    rotation.resolve(refreshed())
    const results = await requests
    expect(results[3]).toBeUndefined()
    expect(callsTo('/api/auth/refresh')).toHaveLength(1)
    expect(callsTo('/api/auth/me')).toHaveLength(1)
    expect(callsTo('/api/documents')).toHaveLength(2)
    expect(callsTo('/api/reports')).toHaveLength(1)
    const authenticatedCalls = network.mock.calls.filter(([url]) => url !== '/api/auth/refresh')
    expect(authenticatedCalls.every(([, options]) => authorization(options) === `Bearer ${fresh}`)).toBe(true)
    expect(HttpClientFactory.getInstance() === client).toBe(true)
    expect(store.refreshToken === 'synthetic-rotated').toBe(true)
  })

  it('offline startup preserves credentials and a later setup can restore the session', async () => {
    remember()
    network.mockRejectedValueOnce(new TypeError('Offline'))
    await setupAuth()
    expect(store.accessToken === expired && store.refreshToken === 'synthetic-refresh').toBe(true)
    network.mockResolvedValueOnce(refreshed()).mockResolvedValueOnce(json(profile))
    await setupAuth()
    expect(useAuth().isAuthenticated()).toBe(true)
    expect(callsTo('/api/auth/refresh')).toHaveLength(2)
  })
})
