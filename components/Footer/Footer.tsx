import React from "react";
//styles
import styles from "./Footer.module.scss";
//next
import Link from "next/link";
//components
import GradientBackground from "../GradientBackground/GradientBackground";

export default function Footer() {
  return (
    <footer className={`${styles.footer} gradient-bg`}>
      <GradientBackground />
      <div className={`${styles.inner_footer} container`}>
        <section>
          <h3>Patron box</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Exercitationem nostrum aut architecto iste assumenda, ullam optio
            nisi dolorum? Quas, assumenda.
          </p>
        </section>
        <section>
          <h3>Navigace</h3>
          <ul>
            <li>
              <Link href="/about">O nás</Link>
            </li>
            <li>
              <Link href="/reservation">Rezervace</Link>
            </li>
            <li>
              <Link href="/pricing">Ceník</Link>
            </li>
          </ul>
        </section>
        <section>
          <h3>Kontakt</h3>
          <ul>
            <li>
              <i className="fas fa-envelope"></i>
              <p>patronbox@gmail.com</p>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <p>(+420) 731 011 045</p>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
}
