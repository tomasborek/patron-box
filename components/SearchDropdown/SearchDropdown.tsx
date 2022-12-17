import React, { useEffect, useState } from "react";
//styles
import styles from "./Searchdropdown.module.scss";
//helpers
import { filter } from "../../utils/helpers";
//interfaces
interface Props {
  items: string[];
  placeholder: string;
  onChange: (item: string) => void;
}

export default function SearchDropdown({
  items,
  onChange,
  placeholder,
}: Props) {
  const [term, setTerm] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<string[]>(items);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  return (
    <div className={styles.search_dropdown}>
      <div className={styles.shield}>
        <input
          value={selectedItem ? selectedItem : term}
          onChange={(e) => {
            setSelectedItem(null);
            setTerm(e.target.value);
            setFilteredItems(filter(items, e.target.value));
          }}
          type="text"
          placeholder={placeholder}
        />
        <i className="fas fa-magnifying-glass"></i>
      </div>
      <ul className={term && !selectedItem ? styles.open : ""}>
        {filteredItems.map((item: string, index: number) => (
          <li
            key={index}
            onClick={() => {
              onChange(item);
              setSelectedItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
