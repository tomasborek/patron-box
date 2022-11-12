import React, { useState } from "react";
// next
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
//layouts
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
//componetns
import Notification from "../components/Notification/Notification";
//contexts
import { useMutation } from "react-query";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { ThreeDots } from "react-loading-icons";

export default function Login() {
  //contexts
  const { logIn } = useAuth();
  const router = useRouter();
  //queries
  const loginMutation = useMutation(
    (formData: any) => {
      return axios({
        method: "POST",
        url: "/api/auth",
        data: formData,
      });
    },
    {
      onSuccess: ({ data }: { data: any }) => {
        logIn(data.token);
        router.push("/");
      },
      onError: (error: any) => {
        if (error.response.status === 404) {
          return setGlobalError("Uživatel s tímto emailem neexistuje.");
        } else if (error.response.status === 401) {
          return setGlobalError("Špatné heslo.");
        }
        setGlobalError("Něco se nepovedlo.");
      },
    }
  );
  //state
  const [globalError, setGlobalError] = useState<string | null>(null);
  //functions
  const loginSubmit = (e) => {
    e.preventDefault();
    setGlobalError(null);
    const formData = Object.fromEntries(new FormData(e.target));
    loginMutation.mutate(formData);
  };

  return (
    <>
      <Head>
        <title>Příhlášení | PatronBox</title>
      </Head>
      <AuthLayout>
        <form onSubmit={loginSubmit}>
          <Notification severity="error" message={globalError} />
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
          <button
            className={`btn main ${loginMutation.isLoading ? "loading" : ""}`}
          >
            {loginMutation.isLoading ? <ThreeDots /> : "Přihlásit se"}
          </button>
        </form>
        <Link href="/register">
          <a>Ještě nemám účet...</a>
        </Link>
      </AuthLayout>
    </>
  );
}
