import React from "react";
//styles
import styles from "../styles/pages/Pricing.module.scss";
//next
import Head from "next/head";
//layouts
import Layout from "../Layouts/Layout/Layout";

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Ceník | PatronBox</title>
      </Head>
      <Layout>
        <div className={styles.pricing}>
          <main className="container">
            <h1>Ceník</h1>
            <table>
              <caption>
                <h3>Úschovný box</h3>
              </caption>
              <tbody>
                <tr>
                  <td>1 hodina</td>
                  <td>1 000,-</td>
                </tr>
                <tr>
                  <td>3 hodiny</td>
                  <td>1 000,-</td>
                </tr>
                <tr>
                  <td>12 hodin</td>
                  <td>1 000,-</td>
                </tr>
                <tr>
                  <td>24 hodin</td>
                  <td>1 000,-</td>
                </tr>
                <tr>
                  <td>48 hodin</td>
                  <td>1 000,-</td>
                </tr>
                <tr>
                  <td>72 hodin</td>
                  <td>1 000,-</td>
                </tr>
              </tbody>
            </table>
          </main>
        </div>
      </Layout>
    </>
  );
}
