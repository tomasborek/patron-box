import React, { useState } from "react";
//styles
import styles from "../styles/pages/Reservation.module.scss";
//next
import Head from "next/head";
//layouts
import Layout from "../Layouts/Layout/Layout";
//components
import Dropdown from "../components/Dropdown/Dropdown";

export default function Reservation() {
  const [length, setLength] = useState<number>(1);
  return (
    <>
      <Head>
        <title>Rezervace | PatronBox</title>
      </Head>
      <Layout>
        <div className={`${styles.reservation} container`}>
          <h1>Rezervace</h1>
          <section>
            <section>
              <label>Zvolit stanici</label>
              <Dropdown name="Stanice" items={["Stanice 1 - SSPŠ"]} />
            </section>
            <section>
              <label>Zvolit délku rezervace</label>
              <Dropdown
                name="Délka"
                items={[
                  "1 hodina",
                  "3 hodiny",
                  "6 hodin",
                  "12 hodin",
                  "24 hodin",
                  "48 hodin",
                  "72 hodin",
                ]}
              />
            </section>
          </section>
          <section>
            <section>
              <p>0 hodin</p>
              <h3>0,00Kč</h3>
              <p>Žádná stanice</p>
            </section>
            <button className="btn main">Dokončit a zaplatit</button>
          </section>
        </div>
      </Layout>
    </>
  );
}
