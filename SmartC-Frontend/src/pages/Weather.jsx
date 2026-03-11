import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getWeatherForecasts,
  createWeatherForecast,
  deleteWeatherForecast,
} from '../api/client'
import styles from './Weather.module.css'

export default function Weather() {
  const { isAdmin } = useAuth()
  const [forecasts, setForecasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [createDate, setCreateDate] = useState('')
  const [createTemp, setCreateTemp] = useState('')
  const [createSummary, setCreateSummary] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  const loadForecasts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getWeatherForecasts()
      setForecasts(data)
    } catch (err) {
      setError(err.message || 'Failed to load weather')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadForecasts()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreateLoading(true)
    try {
      await createWeatherForecast({
        date: createDate,
        temperatureC: parseInt(createTemp, 10),
        summary: createSummary || undefined,
      })
      setCreateDate('')
      setCreateTemp('')
      setCreateSummary('')
      setCreateOpen(false)
      await loadForecasts()
    } catch (err) {
      setCreateError(err.message || 'Failed to create')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDelete = async (index) => {
    setDeleteLoading(index)
    try {
      await deleteWeatherForecast(index)
      await loadForecasts()
    } catch (err) {
      setError(err.message || 'Failed to delete')
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Weather forecast</h1>
        {isAdmin && (
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setCreateOpen(!createOpen)}
          >
            {createOpen ? 'Cancel' : '+ Add forecast'}
          </button>
        )}
      </div>

      {isAdmin && createOpen && (
        <form onSubmit={handleCreate} className={styles.createForm}>
          {createError && <div className={styles.error}>{createError}</div>}
          <div className={styles.createRow}>
            <label className={styles.label}>
              Date
              <input
                type="date"
                value={createDate}
                onChange={(e) => setCreateDate(e.target.value)}
                required
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Temp (°C)
              <input
                type="number"
                value={createTemp}
                onChange={(e) => setCreateTemp(e.target.value)}
                required
                className={styles.input}
                placeholder="20"
              />
            </label>
            <label className={styles.label}>
              Summary
              <input
                type="text"
                value={createSummary}
                onChange={(e) => setCreateSummary(e.target.value)}
                className={styles.input}
                placeholder="Mild"
              />
            </label>
            <button type="submit" className={styles.submitBtn} disabled={createLoading}>
              {createLoading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <p className={styles.loading}>Loading forecasts…</p>
      ) : forecasts.length === 0 ? (
        <p className={styles.empty}>No forecasts yet.</p>
      ) : (
        <ul className={styles.list}>
          {forecasts.map((f, index) => (
            <li key={`${f.date}-${index}`} className={styles.card}>
              <div className={styles.cardMain}>
                <span className={styles.date}>{f.date}</span>
                <span className={styles.temp}>{f.temperatureC}°C</span>
                <span className={styles.tempF}>{f.temperatureF}°F</span>
                <span className={styles.summary}>{f.summary || '—'}</span>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(index)}
                  disabled={deleteLoading === index}
                  title="Delete (Admin only)"
                >
                  {deleteLoading === index ? '…' : 'Delete'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
