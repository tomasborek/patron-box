import React, { useEffect, useState } from "react";
//styles
import styles from "../../styles/pages/Reservation.module.scss";
//next
import Head from "next/head";
import { useRouter } from "next/router";
//layouts
import Layout from "../../Layouts/Layout/Layout";
//components
import Loading from "../../components/Loading/Loading";
import Notification from "../../components/Notification/Notification";
//contexts
import { useAuth } from "../../contexts/AuthContext";
import DataInput from "./Components/DataInput/DataInput";
//hooks
import { useGetStations } from "../../hooks/queryHooks";
import { useNotification } from "../../hooks/hooks";
import Summary from "./Components/Summary/Summary";
import { useMutation } from "react-query";
import axios from "axios";
//interface
import { Station, Alert, CurrentUser } from "../../interfaces/interfaces";
interface MutationProps {
  boxId: number;
  length: number;
  selectedStation: Station;
}

export default function Reservation() {
  //contexts
  const { currentUser }: { currentUser: CurrentUser } = useAuth();
  const router = useRouter();

  //state
  const [length, setLength] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [notification, setNotification] = useState<Alert | null>(null);
  const notify = useNotification(setNotification);

  //queries
  const { stations, stationsQuery } = useGetStations();
  const createReservation = useMutation(
    ({ boxId, length, selectedStation }: MutationProps) => {
      return axios({
        method: "POST",
        url: `/api/station/${selectedStation.id}/box/${boxId}/reservation`,
        headers: {
          authorization: currentUser ? `Bearer ${currentUser.token}` : null,
        },
        data: { length },
      });
    },
    {
      onSuccess: ({ data }) => router.push(`/reservation/complete/${data.id}`),
      onError: () => notify("error", "Něco se pokazilo"),
    }
  );

  return (
    <>
      <Head>
        <title>Rezervace | PatronBox</title>
      </Head>

      <Layout>
        <div className={`${styles.reservation} container`}>
          <Notification notification={notification} />
          <h1>Rezervace</h1>
          {stationsQuery.isSuccess && !createReservation.isLoading ? (
            <>
              <DataInput
                setSelectedStation={setSelectedStation}
                setLength={setLength}
              />
              <Summary
                createReservation={createReservation.mutate}
                length={length}
                notify={notify}
                selectedStation={selectedStation}
              />
            </>
          ) : (
            <Loading />
          )}
        </div>
      </Layout>
    </>
  );
}
