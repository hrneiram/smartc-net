import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Layout.module.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          SmartC
        </Link>
        <nav className={styles.nav}>
          <span className={styles.user}>
            {user?.email} <span className={styles.role}>({user?.role})</span>
          </span>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
