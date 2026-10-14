import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { ButtonPrimary, FleetLogo } from '../../shared/ui'
import styles from './LoginPage.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HERO_IMAGE = '/Fleet 360_BK (2)/Login.jpg'

type FieldErrors = {
  email?: string
  password?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const authError = useAuthStore((state) => state.error)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
    return <Navigate to={from && from !== '/login' ? from : '/'} replace />
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = 'Enter a valid email address.'
    }
    if (password.length === 0) {
      errors.password = 'Password is required.'
    }
    return errors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    await login({ email: email.trim(), password })
    setSubmitting(false)

    if (useAuthStore.getState().isAuthenticated) {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.formPanel}>
        <FleetLogo variant="light" className={styles.title} />
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email ? <p className={styles.fieldError}>{fieldErrors.email}</p> : null}
          </div>
          <div className={styles.field}>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password ? (
              <p className={styles.fieldError}>{fieldErrors.password}</p>
            ) : null}
          </div>
          <div className={styles.forgotRow}>
            <Link to="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
          </div>
          {authError ? <p className={styles.formError} role="alert">{authError}</p> : null}
          <ButtonPrimary type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </ButtonPrimary>
          <p className={styles.legal}>
            By clicking login, you hereby agree to our{' '}
            <a href="#terms">Terms and Conditions</a> &amp;{' '}
            <a href="#privacy">Privacy Notice</a>
          </p>
        </form>
        <footer className={styles.footer}>
          <span>Powered by</span>
          <img src="/velocityone-studio-logo.png" alt="ACL Digital" className={styles.footerLogo} />
        </footer>
      </section>
      <section className={styles.heroPanel} aria-hidden>
        <img src={HERO_IMAGE} alt="" className={styles.heroImage} />
      </section>
    </div>
  )
}
