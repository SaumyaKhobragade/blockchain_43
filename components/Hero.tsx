"use client"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import styles from "./hero.module.css"

const Hero: React.FC = () => {
  return (
    <section className={styles.hero} id="home">
      <div className={`${styles['hero-body']} margin-center`}>
        <div className={styles['hero-desc']}>
          <div className={styles['hero-intro']}>
            <p>Welcome to <span className={styles['hero_intro_wave']}>📚</span></p>
            <h1>
              <span className={`${styles['hero_intro_name']} gradient-txt`}>
                IntelliX
              </span>
            </h1>
            <p>
              Create, Store & Share&nbsp;
              <span id="typewriter">Academic Records on FileCoin</span>
            </p>
            <Link className="btn primary sparkle mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:scale-105 transition-transform" href="/create">
              Create Report Card
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          <ul className={styles['hero-socials']}>
            <li>
              <Link className={styles['hero-socials_link']} href="/create">
                <i className="fa-solid fa-plus"></i>
                <span>Create New</span>
              </Link>
            </li>
            <li>
              <Link className={styles['hero-socials_link']} href="/view">
                <i className="fa-solid fa-list"></i>
                <span>View All</span>
              </Link>
            </li>
            <li>
              <Link className={styles['hero-socials_link']} href="/store">
                <i className="fa-solid fa-database"></i>
                <span>FileCoin Storage</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles['hero-pfp']}>
          <Image 
            src="/assets/logos/logo.svg" 
            alt="Report Card Generator Logo" 
            width={380} 
            height={380} 
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
