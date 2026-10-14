import { useNavigate } from 'react-router-dom'
import { ButtonPrimary, CardSurface, FleetLogo } from '../../shared/ui'
import styles from './LandingPage.module.css'

const MODULES = [
  {
    key: 'devices',
    title: 'Devices',
    description:
      'Manage devices effortlessly with unified control and real-time insights.',
    cta: 'Manage Devices',
    to: '/devices',
  },
  {
    key: 'sites',
    title: 'Sites',
    description:
      'Manage sites with seamless oversight and instant control with visual hierarchy.',
    cta: 'Manage Sites',
    to: '/sites',
  },
  {
    key: 'users',
    title: 'Users',
    description:
      'Assign roles per site with granular access controls for easy user management.',
    cta: 'Manage Users',
    to: '/users',
  },
] as const

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <section className={styles.topBand}>
        <FleetLogo className={styles.topLogo} />
        <div className={styles.welcome}>
          <p className={styles.welcomeLead}>Welcome to</p>
          <h1 className={styles.welcomeTitle}>Fleet 360</h1>
          <p className={styles.welcomeBody}>
            Complete visibility into your data, total control over your insights.
            Empowering secure, real-time analytics with precision and speed.
          </p>
        </div>
      </section>
      <section className={styles.bottomBand}>
        <div className={styles.cards}>
          {MODULES.map((module) => (
            <CardSurface key={module.key} className={styles.card}>
              <h2 className={styles.cardTitle}>{module.title}</h2>
              <p className={styles.cardDescription}>{module.description}</p>
              <ButtonPrimary type="button" onClick={() => navigate(module.to)}>
                {module.cta}
              </ButtonPrimary>
            </CardSurface>
          ))}
        </div>
      </section>
    </div>
  )
}
