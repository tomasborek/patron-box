import React, { useEffect, useState } from "react";
//styles
import styles from "../../styles/pages/Reservation.module.scss";
//next
import Head from "next/head";
import { useRouter } from "next/router";
//layouts
import Layout from "../../Layouts/Layout/Layout";
//components
import Dropdown from "../../components/Dropdown/Dropdown";
import Loading from "../../components/Loading/Loading";
import Notification from "../../components/Notification/Notification";
//dependencies
import { useMutation, useQuery } from "react-query";
import axios from "axios";
//contexts
import { useAuth } from "../../contexts/AuthContext";
//interface
interface Box {
  localId: number;
  available: boolean;
  reservation: object | null;
}
interface Station {
  id: number;
  localId: number;
  institutionId: number;
  boxes: Box[];
}

export default function Reservation() {
  const [length, setLength] = useState<number | null>(null);
  const { currentUser } = useAuth();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const router = useRouter();
  const [notification, setNotification] = useState<{
    severity: string;
    message: string;
  } | null>(null);
  //queries
  const { data: stations, refetch: stationsRefetch } = useQuery(
    "stations",
    () => {
      return axios({
        method: "GET",
        url: `/api/institution/${currentUser.institution}/station`,
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
      });
    },
    { enabled: false }
  );
  const createReservation = useMutation(
    (boxId: number) => {
      return axios({
        method: "POST",
        url: `/api/institution/${currentUser.institution}/station/${selectedStation.localId}/box/${boxId}/reservation`,
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
        data: {
          length,
        },
      });
    },
    {
      onSuccess: ({ data }) => {
        router.push(`/reservation/complete/${data.id}`);
      },
      onError: () => {
        setNotification({
          severity: "error",
          message: "Něco se pokazilo",
        });
      },
    }
  );

  //side effects
  useEffect(() => {
    if (!currentUser) return;
    stationsRefetch();
  }, [currentUser]);

  //functions
  const selectStation = (localId: number) => {
    setSelectedStation(
      stations.data.filter((station) => station.localId === localId)[0]
    );
  };

  const submit = () => {
    if (!selectedStation) {
      return setNotification({
        severity: "error",
        message: "Vyberte prosím stanici.",
      });
    }
    if (!length) {
      return setNotification({
        severity: "error",
        message: "Zadejte prosím délku rezervace.",
      });
    }

    const validBox: Box | undefined = selectedStation.boxes.filter(
      (box: Box) => box.reservation === null
    )[0];
    if (!validBox) {
      return setNotification({
        severity: "error",
        message: "Tato stanice není volná.",
      });
    }
    createReservation.mutate(validBox.localId);
  };

  return (
    <>
      <Head>
        <title>Rezervace | PatronBox</title>
      </Head>

      <Layout>
        <div className={`${styles.reservation} container`}>
          {notification && (
            <Notification
              severity={notification.severity}
              message={notification.message}
            />
          )}
          <h1>Rezervace</h1>
          {stations && !createReservation.isLoading ? (
            <>
              <section>
                <section>
                  <label>Zvolit stanici</label>
                  <Dropdown
                    name="Stanice"
                    onChange={(item) =>
                      selectStation(parseInt(item.split(" ")[1]))
                    }
                    items={stations.data.map((station: Station, index) => {
                      let available = false;
                      station.boxes.forEach((box: Box) => {
                        if (!box.reservation) {
                          available = true;
                        }
                      });
                      if (available) {
                        return `Stanice ${station.localId} - ${currentUser.institution}`;
                      }
                    })}
                  />
                </section>
                <section>
                  <label>Zvolit délku rezervace</label>
                  <Dropdown
                    name="Délka"
                    onChange={(item) => setLength(parseInt(item.split(" ")[0]))}
                    items={[
                      "1 hodina",
                      "3 hodiny",
                      "6 hodin",
                      "12 hodin",
                      "24 hodin",
                      "48 hodin",
                      "72 hodin",
                    ]}
                  />
                </section>
              </section>
              <section>
                <section>
                  <p>0 hodin</p>
                  <h3>0,00Kč</h3>
                  <p>Žádná stanice</p>
                </section>
                <button onClick={submit} className="btn main">
                  Dokončit a zaplatit
                </button>
              </section>
            </>
          ) : (
            <Loading />
          )}
        </div>
      </Layout>
    </>
  );
}
