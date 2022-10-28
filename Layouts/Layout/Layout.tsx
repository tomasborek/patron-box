import React, { ReactNode } from "react";
//styles
import styles from "./Layout.module.scss";
//components
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root_layout}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
