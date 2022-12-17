import React, { useState } from "react";
// next
import Link from "next/link";
import Head from "next/head";
//layouts
import AuthLayout from "../../Layouts/AuthLayout/AuthLayout";
//componetns
import Notification from "../../components/Notification/Notification";
//contexts
import { ThreeDots } from "react-loading-icons";
//interfaces
import { Alert } from "../../interfaces/interfaces";
//hoks
import { useLogin } from "./Hooks";

export default function Login() {
  //state
  const [notification, setNotification] = useState<Alert | null>(null);
  const { notify, submit, isLoading } = useLogin(setNotification);
  return (
    <>
      <Head>
        <title>Příhlášení | PatronBox</title>
      </Head>
      <AuthLayout>
        <form onSubmit={submit}>
          <Notification notification={notification} />
          <h2>Přihlášení</h2>
          <section>
            <input
              name="email"
              type="email"
              required
              placeholder="Tvůj školní email..."
            />
            <input
              name="password"
              required
              type="password"
              placeholder="Heslo..."
            />
            <a>Zapomenuté heslo</a>
          </section>
          <button className={`btn main ${isLoading ? "loading" : ""}`}>
            {isLoading ? <ThreeDots /> : "Přihlásit se"}
          </button>
        </form>
        <Link href="/register">
          <a>Ještě nemám účet...</a>
        </Link>
      </AuthLayout>
    </>
  );
}
