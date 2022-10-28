import React, { useState } from "react";
//next
import Link from "next/link";
import Head from "next/head";
//Layouts
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
//components
import Dropdown from "../components/Dropdown/Dropdown";

export default function Register() {
  const [institution, setInstitution] = useState<string | null>(null);
  return (
    <>
      <Head>
        <title>Registrace | PatronBox</title>
      </Head>
      <AuthLayout>
        <form>
          <h2>Registrace</h2>
          <section>
            <Dropdown
              name="Instituce"
              returnValue={setInstitution}
              items={["SSPŠ"]}
            ></Dropdown>
            <input type="text" placeholder="Tvé jméno a příjmení..." />
            <input type="text" placeholder="Tvůj školní email..." />
            <input type="password" placeholder="Heslo..." />
            <input type="password" placeholder="Heslo znovu..." />
          </section>
          <button className="btn main">Registrovat</button>
        </form>
        <Link href={"/login"}>
          <a>Již mám účet...</a>
        </Link>
      </AuthLayout>
    </>
  );
}
