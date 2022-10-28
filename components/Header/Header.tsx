import React from "react";
//next
import Link from "next/link";
//styles
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <img src="/img/logos/logo.svg" alt="Logo Patron" />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href={"/about"}>O nás</Link>
          </li>
          <li>
            <Link href={"/reservation"}>Rezervovat</Link>
          </li>
          <li>
            <Link href={"/pricing"}>Ceník</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.login}>
        <Link href="/login">
          <i className="fas fa-right-to-bracket"></i>
        </Link>
      </div>
    </header>
  );
}
