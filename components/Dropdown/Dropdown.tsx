import React, { ReactNode, useState, useEffect } from "react";
//styles
import styles from "./Dropdown.module.scss";

const Dropdown = ({
  items = null,
  name,
  onChange = null,
  action = false,
  children = null,
  defaultValue = null,
}: {
  items?: string[] | null;
  name: string;
  onChange?: (item: string) => void | null;
  action?: boolean;
  children?: ReactNode;
  defaultValue?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string | null>(
    defaultValue ? defaultValue : null
  );
  useEffect(() => {
    if (!defaultValue) return;
    onChange(defaultValue);
  }, []);
  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      className={`${styles.dropdown} ${action ? styles.action : ""} dropdown`}
    >
      <div className={styles.shield}>
        <p>{currentValue && !action ? currentValue : name}</p>
        <i className={`fas fa-chevron-down  ${open ? styles.open : ""}`}></i>
      </div>
      {action ? (
        <ul className={` ${open ? styles.open : ""}`}>{children}</ul>
      ) : (
        <ul className={`${open ? styles.open : ""}`}>
          {items?.length ? (
            items.map((item, index) => (
              <li
                onClick={() => {
                  onChange(item);
                  setCurrentValue(item);
                }}
                key={index}
              >
                {item}
              </li>
            ))
          ) : (
            <li>Žádné výsledky</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
