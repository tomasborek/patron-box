import React, { ReactNode, useState, useEffect } from "react";
//styles
import styles from "./Dropdown.module.scss";

const Dropdown = ({
  items,
  name,
  returnValue = null,
}: {
  items: string[];
  name: string;
  returnValue?: (value: string | null) => any;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string | null>(null);

  useEffect(() => {
    if (!returnValue) return;
    returnValue(currentValue);
  }, [currentValue]);

  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      className={`${styles.dropdown} dropdown`}
    >
      <div className={`dropdown-content`}>
        <p className={`dropdown-content`}>
          {currentValue ? currentValue : name}
        </p>
        <i
          className={`fas fa-chevron-down dropdown-content ${
            open ? styles.open : ""
          }`}
        ></i>
      </div>
      <ul className={`dropdown-content ${open ? styles.open : ""}`}>
        {items.map((item, index) => (
          <li onClick={() => setCurrentValue(item)} key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
