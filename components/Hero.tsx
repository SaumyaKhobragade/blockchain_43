"use client"

import Link from "next/link"
import styles from "./hero.module.css"

const Hero: React.FC = () => {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.tag}>Decentralized academic vault</span>
          <h1 className={styles.title}>
            Own every milestone your learners achieve.
          </h1>
          <p className={styles.lead}>
            IntelliX turns traditional report cards into portable, verifiable credentials anchored on Filecoin. Draft once, sign with a wallet, and share trusted records anywhere in the world.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/create">
              Start creating
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryAction} href="/view">
              Explore records
            </Link>
          </div>
          <ul className={styles.benefits}>
            <li>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              Wallet-aware workflows keep submissions compliant and auditable.
            </li>
            <li>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              Attach media, notes, and credentials while preserving student privacy.
            </li>
            <li>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              Export polished PDFs or share one-click verification links powered by IPFS.
            </li>
          </ul>
        </div>

        <div className={styles.showcase}>
          <div className={styles.card}>
            <header className={styles.cardHeader}>
              <div className={styles.cardStatus}>Verified</div>
              <div>
                <p className={styles.cardEyebrow}>Student</p>
                <h3 className={styles.cardTitle}>Maya Chen</h3>
              </div>
            </header>

            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Overall grade</span>
                <span className={styles.metricValue}>A+</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Attendance</span>
                <span className={styles.metricValue}>98%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>STEM index</span>
                <span className={styles.metricValue}>94</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Last update</span>
                <span className={styles.metricValue}>Apr 02</span>
              </div>
            </div>

            <div className={styles.cid}>
              <span className={styles.cidLabel}>CID</span>
              <code className={styles.cidValue}>bafybeibp5m2m4n4kz7p4ki332u7vlz4u5h7g6zqyx3rt2t6v54xpq3n5ae</code>
            </div>

            <div className={styles.badgeList}>
              <span>STEM Excellence</span>
              <span>Community Builder</span>
              <span>Scholarship Ready</span>
            </div>
          </div>

          <div className={styles.statStrip}>
            <div>
              <strong>4.2k</strong>
              <span>records notarized</span>
            </div>
            <div>
              <strong>62</strong>
              <span>institutions onboarded</span>
            </div>
            <div>
              <strong>12s</strong>
              <span>average verification</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
