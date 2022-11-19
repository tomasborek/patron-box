import React, { ReactNode, useEffect, useState } from "react";
//styles
import styles from "../styles/pages/Admin.module.scss";
//next
import Head from "next/head";
//components
import Loading from "../components/Loading/Loading";
import Dropdown from "../components/Dropdown/Dropdown";
import Notification from "../components/Notification/Notification";
//layouts
import Layout from "../Layouts/Layout/Layout";
//context
import { useAuth } from "../contexts/AuthContext";
//dependencies
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
//interfaces
interface Notif {
  message: string;
  severity: string;
}
type Notification = Notif | null;

export default function AdminPanel() {
  //contexts
  const { currentUser } = useAuth();
  //state
  //queries
  //side effects
  //functions
  return (
    <>
      <Head>
        <title>Admin | PatronBox</title>
      </Head>
      <Layout>
        {currentUser?.admin ? (
          <div className={styles.admin}>
            <main className="container">
              <CreateInstitution />

              <CreateStation />
            </main>
          </div>
        ) : (
          <Loading />
        )}
      </Layout>
    </>
  );
}

const CreateInstitution = () => {
  //context
  const { currentUser } = useAuth();
  //state
  const [authForm, setAuthForm] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification>(null);

  //queries
  const createInstitution = useMutation(
    (formData: any) => {
      return axios({
        method: "POST",
        url: `/api/institution`,
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
        data: formData,
      });
    },
    {
      onSuccess: () =>
        setNotification({
          message: "Instituce vytvořena",
          severity: "success",
        }),
      onError: () =>
        setNotification({ message: "Něco se pokazilo", severity: "error" }),
    }
  );

  const submit = (e) => {
    e.preventDefault();
    let formData = Object.fromEntries(new FormData(e.target));
    if (!authForm)
      return setNotification({
        message: "Zadejte prosím všechna pole",
        severity: "error",
      });
    formData = { ...formData, authForm };
    if (!formData.name)
      return setNotification({
        message: "Zadejte jméno prosím.",
        severity: "error",
      });
    if (!formData.password && !formData.emailForm) {
      return setNotification({
        message: "Zadejte všechny pole.",
        severity: "error",
      });
    }
    createInstitution.mutate(formData);
  };
  return (
    <Section
      notification={notification}
      loading={createInstitution.isLoading}
      heading="Vytvořit instituci"
    >
      <>
        <form onSubmit={submit}>
          <div className={styles.input_item}>
            <p>Název</p>
            <input type="text" name="name" />
          </div>
          <div className={styles.input_item}>
            <Dropdown
              name="Forma autentifikace"
              onChange={(item: string) => setAuthForm(item)}
              items={["email", "password"]}
            />
          </div>
          {authForm === "password" ? (
            <div className={styles.input_item}>
              <p>Heslo</p>
              <input type="password" name="password" />
            </div>
          ) : authForm === "email" ? (
            <div className={styles.input_item}>
              <p>Formát emailu</p>
              <input type="text" name="emailFormat" />
            </div>
          ) : (
            ""
          )}
          <button className="btn main">Vytvořit</button>
        </form>
      </>
    </Section>
  );
};

const CreateStation = () => {
  //context
  const { currentUser } = useAuth();
  //state
  const [notification, setNotification] = useState<Notification>(null);
  //queries
  const createStation = useMutation(
    (formData: any) => {
      return axios({
        method: "POST",
        url: `/api/institution/${formData.institutionName}/station`,
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
        data: {
          localId: formData.localId,
          boxesCount: formData.boxesCount ? formData.boxesCount : 9,
        },
      });
    },
    {
      onSuccess: () =>
        setNotification({ message: "Stanice vytvořena", severity: "success" }),
      onError: (error: any) => {
        console.log(error.response.status);
      },
    }
  );
  //functions
  const submit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    if (!formData.institutionName)
      return setNotification({
        message: "Zadejte jméno instituce.",
        severity: "error",
      });
    if (!formData.localId)
      return setNotification({
        message: "Zadejte prosím lokální id",
        severity: "error",
      });
    createStation.mutate(formData);
  };
  return (
    <Section notification={notification} heading="Vytvořit stanici">
      <form onSubmit={submit}>
        <div className={styles.input_item}>
          <p>Název instituce</p>
          <input type="text" name="institutionName" />
        </div>
        <div className={styles.input_item}>
          <p>Lokální id</p>
          <input type="number" name="localId" />
        </div>
        <div className={styles.input_item}>
          <p>Počet boxů</p>
          <input type="number" name="boxesCount" defaultValue={9} />
        </div>
        <button className="btn main">Vytvořit</button>
      </form>
    </Section>
  );
};

const Section = ({
  heading,
  children,
  loading = false,
  notification = null,
  stepBack = null,
}: {
  heading: string;
  children: ReactNode;
  loading?: boolean;
  notification?: Notification;
  stepBack?: () => void;
}) => {
  return (
    <section>
      {!loading ? (
        <>
          {notification ? (
            <Notification
              message={notification.message}
              severity={notification.severity}
            />
          ) : (
            ""
          )}
          <header>
            {stepBack ? (
              <i className="fas fa-arrow-left" onClick={stepBack}></i>
            ) : (
              ""
            )}
            <h3>{heading}</h3>
          </header>
          {children}
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
};
