import React from "react";
//styles
import styles from "./GradientBackground.module.scss";

const GradientBackground = ({ size = 250 }: { size?: number }) => {
  return (
    <>
      <div className={styles.gradient_bg}>
        <div
          style={{ width: size, height: size, filter: `blur(${size - 25}px)` }}
          className={styles.dot}
        ></div>
        <div
          style={{ width: size, height: size, filter: `blur(${size - 25}px)` }}
          className={styles.dot}
        ></div>
      </div>
    </>
  );
};

export default GradientBackground;
