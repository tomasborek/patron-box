import React from "react";
//styles
import styles from "./Loading.module.scss";
//components
import { TailSpin } from "react-loading-icons/";
export default function Loading() {
  return (
    <div className={styles.loading}>
      <TailSpin color="#333" />
    </div>
  );
}
