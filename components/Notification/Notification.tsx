import React from "react";
import styles from "./Notification.module.scss";

export default function Notification({
  message,
  severity,
}: {
  message: string | null;
  severity: string;
}) {
  if (message) {
    return (
      <div
        className={`${styles.error} ${
          severity === "error"
            ? styles.error
            : severity === "success"
            ? styles.success
            : ""
        }`}
      >
        <p>{message}</p>
      </div>
    );
  } else {
    return <></>;
  }
}
