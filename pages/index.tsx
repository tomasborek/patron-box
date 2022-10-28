import React, { ReactNode } from "react";
//styles
import styles from "../styles/pages/Home.module.scss";
//next
import Link from "next/link";
//components
import Banner from "../components/Banner/Banner";
import GradientBackground from "../components/GradientBackground/GradientBackground";
//layouts
import Layout from "../Layouts/Layout/Layout";

export default function Home() {
  return (
    <Layout>
      <div className={styles.home}>
        <div className="big-container">
          <Banner />
        </div>
        <main className="container">
          <section className={styles.how_it_works}>
            <header>
              <h2>Jak to funguje?</h2>
            </header>
            <div className={styles.steps}>
              <section>
                <i className="fas fa-user"></i>
                <p>Přihlásíš se</p>
              </section>
              <i className="fas fa-angles-right"></i>
              <section>
                <i className="fas fa-box-archive"></i>
                <p>Rezervuješ si box</p>
              </section>
              <i className="fas fa-angles-right"></i>
              <section>
                <i className="fas fa-lock-open"></i>
                <p>Obdržíš kód</p>
              </section>
            </div>
          </section>
          <section className={styles.about}>
            <div className={styles.text}>
              <p>
                Patron je úschovná skříň, sloužící pro odkládání věcí a pozdější
                vyzvednutí, ať už stejnou osobou, či někým jiným. Můžete tak
                předat různé předměty, bez vymýšlení a domlouvání, kdy se s
                danným člověkem sejdete.
              </p>
              <p>
                Pro použití se musíte nejdříve přihlásit vaším školním emailem a
                poté ho ověřit, poté stačí kliknout na rezervovat box a systém
                vám sám vybere schránku, kde je volno a vy obdržíte do emailu
                kód a číslo boxu. Tento box bude přístupný pod tímto kódem po
                dobu, kterou jste zadali u rezervace. Po uplynutí doby rezervace
                se box uzamkne bez kódu a bude znovu volný pro novou rezervaci.
              </p>
            </div>
            <Aside
              image="/img/index/trezor-closed.png"
              alt="Trezor"
              button="Rezervovat"
              link="/resevation"
            >
              Momentálně máme <br /> <span>8</span> <br /> boxů volných
            </Aside>
          </section>
          <section className={styles.cost}>
            <header>
              <h2>Kolik to stojí?</h2>
            </header>
            <div className={styles.content}>
              <Aside
                image="/img/index/bills.png"
                alt="Trezor"
                button="Ceník"
                link="/pricing"
              >
                Výhodné <br /> pronájímání <br /> <span>boxů</span>
              </Aside>
              <div className={styles.text}>
                <p>
                  Cena se odvíjí od časového úseku,po jakou dobu chcete věci
                  uschovat. Hodinnové sazby budou v rozmezí 1h, 3h, 24h, 48h až
                  72hodin což bude maximum.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

const Aside = ({
  children,
  image,
  alt,
  button,
  link,
}: {
  children: ReactNode;
  image: string;
  alt: string;
  button: string;
  link: string;
}) => {
  return (
    <aside className="gradient-bg">
      <img src={image} alt={alt} />
      <GradientBackground size={100} />
      <h3>{children}</h3>
      <Link href={link}>
        <button className="btn main">{button}</button>
      </Link>
    </aside>
  );
};
