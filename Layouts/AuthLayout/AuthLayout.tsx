import React, { ReactNode } from "react";
//styles
import styles from "./AuthLayout.module.scss";
//Layouts
import Layout from "../Layout/Layout";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <div className={styles.auth}>
        <h1>
          PATRON <span>BOX</span>
        </h1>
        <main className="container">{children}</main>
      </div>
    </Layout>
  );
}
