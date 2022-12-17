import React, { useEffect } from "react";
import styles from "./Reservations.module.scss";
import { Reservation, User } from "../../../../../interfaces/interfaces";
import { useGetProfile } from "../../../../../hooks/queryHooks";
export default function Reservations() {
  const { userInfo, userQuery } = useGetProfile();
  useEffect(() => {
    console.log(userInfo);
  }, []);
  return (
    <div className={styles.reservations}>
      <header>
        <h2>Rezervace</h2>
      </header>
      <section>
        {userInfo.reservations?.length ? (
          <>
            {userInfo.reservations.map(
              (reservation: Reservation, index: number) => (
                <Reservation key={index} data={reservation} />
              )
            )}
          </>
        ) : (
          <p className={styles.not_found}></p>
        )}
      </section>
    </div>
  );
}

const Reservation = ({ data }: { data: Reservation }) => {
  return (
    <div className={styles.reservation}>
      <header>
        <div className={styles.active_status}></div>
        <h3>{data.box.station.address}</h3>
      </header>
      <div className={styles.content}>
        <div className={styles.item}>
          <b>Od:</b>
          <p>{new Date(data.startTime).toLocaleString("cs")}</p>
        </div>
        <div className={styles.item}>
          <b>Do:</b>
          <p>{new Date(data.endTime).toLocaleString("cs")}</p>
        </div>
        <a href="">Znovu zaslat kód na e-mail</a>
      </div>
      <div className={styles.actions}>
        <button className="btn main">Změnit kód</button>
        <button className="btn">Zrušit rezervaci</button>
      </div>
    </div>
  );
};
