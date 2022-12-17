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
//hooks
import { useParams } from "../../../hooks/hooks";
import { useGetReservation } from "../../../hooks/queryHooks";
//contexts
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../../components/Loading/Loading";

export default function Complete() {
  //contexts
  const router = useRouter();
  const { currentUser } = useAuth();
  const reservationId: number = Number(useParams("id"));
  const { reservationInfo, reservationQuery } = useGetReservation();
  return (
    <Layout>
      {reservationInfo ? (
        <div className={styles.reservation_complete}>
          <main className="container">
            <section>
              <h3>Rezervace úspěšná</h3>
              <div className={styles.item}>
                <p>Stanice a box:</p>
                <p>
                  {reservationInfo.box.station.address}{" "}
                  {reservationInfo.box.station.localId} - Box{" "}
                  {reservationInfo.box.localId}
                </p>
              </div>
              <div className={styles.item}>
                <p>Konec rezervace:</p>
                <p>
                  za {reservationInfo.length}h,{" "}
                  {new Date(reservationInfo.endTime).toLocaleString("cs")}
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
