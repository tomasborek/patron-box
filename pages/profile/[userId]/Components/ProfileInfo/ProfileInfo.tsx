import React from "react";
//styles
import styles from "./ProfileInfo.module.scss";
//hooks
import { useGetProfile } from "../../../../../hooks/queryHooks";
//interfaces
import { User } from "../../../../../interfaces/interfaces";
export default function ProfileInfo() {
  const { userInfo }: { userInfo: User } = useGetProfile();
  if (userInfo) {
    return (
      <div className={styles.profile_info}>
        <header>
          <h3>Informace</h3>
        </header>
        <section>
          <header>
            <h2>{userInfo.name}</h2>
          </header>
          <section className={styles.details}>
            <div className={styles.item}>
              <p>E-mail:</p>
              <p>{userInfo.email}</p>
            </div>
            <div className={styles.item}>
              <p>Instituce:</p>
              <p>
                {userInfo.institution
                  ? userInfo.institution.name
                  : "Žádná instituce"}
              </p>
            </div>
            <div className={styles.item}>
              <p>Aktivní rezervace:</p>
              <p>{userInfo.reservations?.length ? "Ano" : "Ne"}</p>
            </div>
          </section>
        </section>
      </div>
    );
  } else {
    return null;
  }
}
