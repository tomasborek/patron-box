import React, { useState } from "react";
//next
import Link from "next/link";
import Head from "next/head";
//Layouts
import AuthLayout from "../../Layouts/AuthLayout/AuthLayout";
//components
import Notification from "../../components/Notification/Notification";
import { ThreeDots } from "react-loading-icons";
//hooks
import { useRegister } from "./Hooks";
//interfaces
import { Alert } from "../../interfaces/interfaces";

export default function Register() {
  const [notification, setNotification] = useState<Alert | null>(null);
  const { notify, submit, isLoading } = useRegister(setNotification);
  return (
    <>
      <Head>
        <title>Registrace | PatronBox</title>
      </Head>
      <AuthLayout>
        <form onSubmit={submit}>
          <Notification notification={notification} />
          <h2>Registrace</h2>
          <section>
            <input
              name="name"
              required
              type="text"
              placeholder="Tvé jméno a příjmení..."
            />
            <input
              name="email"
              required
              type="text"
              placeholder="Tvůj školní email..."
            />
            <input
              name="password"
              required
              type="password"
              placeholder="Heslo..."
            />
            <input
              name="passwordConfirm"
              type="password"
              placeholder="Heslo znovu..."
            />
          </section>
          <button className={`btn main ${isLoading ? "loading" : ""}`}>
            {isLoading ? <ThreeDots /> : "Registrovat"}
          </button>
        </form>
        <Link href={"/login"}>
          <a>Již mám účet...</a>
        </Link>
      </AuthLayout>
    </>
  );
}
