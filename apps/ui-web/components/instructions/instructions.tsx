import styles from './instructions.module.css'
import { Typography } from '@mui/material'

const instructions = [
  {
    title: 'Apply for a TAP loan',
    desc: "Fill out a quick application and we'll notify you of your approval amount instantly",
  },
  {
    title: 'Securely connect your bank',
    desc: 'Security is our priority. We use integrated APIs from trusted vendors to keep your information safe',
  },
  {
    title: 'Track payments',
    desc: 'Your dashboard will keep you up to date on your available credit and upcoming payments',
  },
  {
    title: 'Ticket is paid',
    desc: "Say goodbye to late fees and legal headaches. We've got you covered",
  },
]

export default function Instructions() {
  return (
    <div>
      {instructions.map((ins, index) => (
        <div className={styles.step} key={index}>
          <div className={styles.circle}>{index + 1}</div>
          <div>
            <Typography sx={{ fontWeight: 600 }}>{ins.title}</Typography>
            <Typography sx={{ fontSize: 12 }}>{ins.desc}</Typography>
          </div>
        </div>
      ))}
    </div>
  )
}
