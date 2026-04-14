import styles from './page.module.css'

export function Dashboard() {
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

export default Dashboard
