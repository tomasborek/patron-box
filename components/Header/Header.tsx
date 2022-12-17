import React from "react";
//next
import Link from "next/link";
//styles
import styles from "./Header.module.scss";
//contexts
import { CurrentUser, useAuth } from "../../contexts/AuthContext";
import Dropdown from "../Dropdown/Dropdown";

export default function Header() {
  const { currentUser }: { currentUser: CurrentUser } = useAuth();
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/">
          <img src="/img/logos/logo.svg" alt="Logo Patron" />
        </Link>
      </div>
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
      {currentUser ? (
        <UserInfo />
      ) : (
        <div className={styles.login}>
          <Link href="/login">
            <i className="fas fa-right-to-bracket"></i>
          </Link>
        </div>
      )}
    </header>
  );
}

const UserInfo = () => {
  const {
    currentUser,
    logOut,
  }: { currentUser: CurrentUser; logOut: () => void } = useAuth();
  return (
    <div className={styles.user_info}>
      <Dropdown action name={currentUser.name}>
        <Link href={`/profile/${currentUser.id}`}>
          <li>
            <>
              <i className="fas fa-user"></i>
              <p>Profil</p>
            </>
          </li>
        </Link>
        <li onClick={logOut}>
          <i className="fas fa-right-from-bracket"></i>
          <p>Odhlásit se</p>
        </li>
      </Dropdown>
    </div>
  );
};
