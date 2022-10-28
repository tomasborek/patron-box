import React from "react";
// next
import Link from "next/link";
import Head from "next/head";
//layouts
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";

export default function Login() {
  return (
    <>
      <Head>
        <title>Příhlášení | PatronBox</title>
      </Head>
      <AuthLayout>
        <form>
          <h2>Přihlášení</h2>
          <section>
            <input type="text" placeholder="Tvůj školní email..." />
            <input type="password" placeholder="Heslo..." />
            <a>Zapomenuté heslo</a>
          </section>
          <button className="btn main">Přihlásit</button>
        </form>
        <Link href="/register">
          <a>Ještě nemám účet...</a>
        </Link>
      </AuthLayout>
    </>
  );
}
