import { useNavigate } from 'react-router-dom'
import { ButtonOutline } from '../../shared/ui'
import styles from './ComingSoonPage.module.css'

type ComingSoonPageProps = {
  title: string
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.copy}>Coming soon.</p>
      <ButtonOutline type="button" onClick={() => navigate('/')}>
        Back to Landing
      </ButtonOutline>
    </div>
  )
}
