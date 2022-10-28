import React from "react";
//styles
import styles from "./Banner.module.scss";
//next
import Link from "next/link";
//components
import GradientBackground from "../GradientBackground/GradientBackground";

const Banner = () => {
  return (
    <div className={`${styles.banner} gradient-bg`}>
      <GradientBackground />
      <div className={`${styles.inner_banner} container`}>
        <section>
          <h1>Patron ochrání vaše cennosti.</h1>
          <h3>
            Uschovejte, či někomu přenechte předměty v rezervovaném boxu na kód
          </h3>
          <Link href="/reservation">
            <button className="btn main">Rezervovat box</button>
          </Link>
        </section>
        <img src="/img/index/trezor.png" alt="Trezor" />
      </div>
    </div>
  );
};

export default Banner;
