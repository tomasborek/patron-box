import React from "react";
import { Alert } from "../../interfaces/interfaces";
import styles from "./Notification.module.scss";

export default function Notification({
  notification,
}: {
  notification: Alert;
}) {
  if (notification?.message) {
    return (
      <div
        className={`${styles.notification} ${
          notification?.severity === "error"
            ? styles.error
            : notification?.severity === "success"
            ? styles.success
            : ""
        }`}
      >
        <p>{notification.message}</p>
      </div>
    );
  } else {
    return null;
  }
}
