import React, { ReactNode, useRef } from "react";
//styles
import styles from "./Modal.module.scss";
//interfaces
interface Props {
  children: ReactNode;
  setOpen: any;
  open: boolean;
}
export default function Modal({ children, setOpen, open }: Props) {
  return (
    <div
      onClick={(e) => {
        if (e.target === document.querySelector(".modal_wrapper"))
          setOpen(false);
      }}
      className={`modal_wrapper ${styles.modal_wrapper} ${
        open ? styles.open : ""
      }`}
    >
      <div className={`modal ${styles.modal}`}>
        <i
          onClick={() => setOpen(false)}
          className={`${styles.close} fas fa-times`}
        ></i>
        {children}
      </div>
    </div>
  );
}
