import React from "react";
//styles
import styles from "./Steps.module.scss";

export default function Steps({
  steps,
  progress,
  onChange,
}: {
  steps: string[];
  progress: number;
  onChange: (step: number) => void;
}) {
  return (
    <div className={styles.steps}>
      <div
        style={{ width: `${(100 / (steps.length - 1)) * (progress - 1)}%` }}
        className={styles.line_progress}
      ></div>
      {steps.map((step: string, index: number) => (
        <div
          onClick={() => onChange(index + 1)}
          className={`${styles.step} ${index < progress ? styles.active : ""}`}
        >
          <span></span>
          <p>{step}</p>
        </div>
      ))}
    </div>
  );
}
