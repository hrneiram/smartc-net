const API_BASE = '' // Vite proxy forwards to http://localhost:5043

function getToken() {
  return localStorage.getItem('token')
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Login failed')
  }
  return data
}

export async function register(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed')
  }
  return data
}

export async function getWeatherForecasts() {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${API_BASE}/WeatherForecast`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to load weather')
  }
  return res.json()
}

export async function createWeatherForecast(forecast) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${API_BASE}/WeatherForecast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(forecast),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized')
    if (res.status === 403) throw new Error('Admin role required')
    throw new Error(data.message || 'Failed to create')
  }
  return data
}

export async function deleteWeatherForecast(index) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${API_BASE}/WeatherForecast/${index}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized')
    if (res.status === 403) throw new Error('Admin role required')
    throw new Error(data.message || 'Failed to delete')
  }
  return data
}
