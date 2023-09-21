import styles from './dashboard.module.css'

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <div className={`wrapper ${styles.wrapper}`}>
        <div className="container">
          <h1>Welcome to Dashboard!</h1>
        </div>
      </div>
    </div>
  )
}
