import React, { useEffect } from "react";
//styles
import styles from "../../../styles/pages/ReservationComplete.module.scss";
//next
import { useRouter } from "next/router";
//layouts
import Layout from "../../../Layouts/Layout/Layout";
//dependencies
import { useQuery } from "react-query";
import axios from "axios";
//contexts
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../../components/Loading/Loading";

export default function Complete() {
  //contexts
  const router = useRouter();
  const { currentUser } = useAuth();
  const { id: reservationId } = router.query;
  //queries
  const reservationInfo = useQuery(
    "reservation",
    () => {
      return axios({
        method: "GET",
        url: `/api/reservation/${reservationId}`,
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
      });
    },
    { enabled: false }
  );

  //side effects
  useEffect(() => {
    if (!currentUser || !router.isReady) return;
    reservationInfo.refetch();
  }, [currentUser, router.isReady]);
  return (
    <Layout>
      {reservationInfo.data ? (
        <div className={styles.reservation_complete}>
          <main className="container">
            <section>
              <h3>Rezervace úspěšná</h3>
              <div className={styles.item}>
                <p>Stanice a box:</p>
                <p>
                  {reservationInfo.data.data.box.station.institution.name}{" "}
                  Stanice {reservationInfo.data.data.box.station.localId} - Box{" "}
                  {reservationInfo.data.data.box.localId}
                </p>
              </div>
              <div className={styles.item}>
                <p>Konec rezervace:</p>
                <p>
                  za {reservationInfo.data.data.length}h,{" "}
                  {new Date(reservationInfo.data.data.endTime).toLocaleString(
                    "cs"
                  )}
                </p>
              </div>
              <div className={styles.item}>
                <p>Kód:</p>
                <p>
                  Kód pro vyzvednutí byl odeslán na emailovou adresu{" "}
                  <span>{currentUser.email}</span>
                </p>
              </div>
            </section>
          </main>
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  );
}
