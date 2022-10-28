import React from "react";
//next
import Head from "next/head";
//styles
import "../styles/globals.scss";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>PatronBox | Úschovné boxy</title>
        <link rel="icon" type="image/x-icon" href="/img/logos/logo.svg" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
          integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta
          name="description"
          content="PatronBox jsou úschovné stanice s boxy, které slouží ke krátkodobému uložení předmětů, cenností a věcí."
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
