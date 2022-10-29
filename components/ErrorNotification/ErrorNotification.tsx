import React from "react";
import styles from "./ErrorNotification.module.scss";

export default function ErrorNotification({ error }: { error: string | null }) {
  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  } else {
    return <></>;
  }
}
