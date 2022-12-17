import React from "react";
//styles
import styles from "./History.module.scss";
//components
import Loading from "../../../../../components/Loading/Loading";
//hooks
import { useGetRecords } from "../../../../../hooks/queryHooks";
//interface
import { Record } from "../../../../../interfaces/interfaces";

export default function History() {
  const { records, recordsQuery } = useGetRecords();
  if (records) {
    return (
      <div className={styles.history}>
        <header>
          <h2>Historie</h2>
        </header>
        <section>
          <table>
            <tr>
              <th>Číslo rezervace</th>
              <th>Datum</th>
              <th>Pobočka</th>
              <th>Doba uložení</th>
            </tr>

            {records.map((record: Record, index: number) => (
              <tr>
                <td>{record.id}</td>
                <td>{new Date(record.startTime).toLocaleString("cs")}</td>
                <td>{record.stationId}</td>
                <td>{record.length}h</td>
              </tr>
            ))}
          </table>
        </section>
      </div>
    );
  } else {
    return <Loading />;
  }
}
