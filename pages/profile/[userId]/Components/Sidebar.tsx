import React from "react";
//styles
import styles from "../Profile.module.scss";
interface Item {
  name: string;
  icon: string;
  view: string;
}
interface Props {
  view: string;
  items: Item[];
  setView: any;
}
export default function Sidebar({ items, setView, view }: Props) {
  return (
    <aside className={styles.sidebar}>
      <h3>Profil uživatele</h3>
      <ul>
        {items.map((item: Item, index: number) => (
          <li
            className={view === item.view ? styles.active : ""}
            onClick={() => setView(item.view)}
          >
            <i className={`fas fa-${item.icon}`}></i>
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
