import React, { useState } from "react";
//next
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
//Layouts
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
//components
import Dropdown from "../components/Dropdown/Dropdown";
import Notification from "../components/Notification/Notification";
import { ThreeDots } from "react-loading-icons";
//dependencies
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
//contexts
import { useAuth } from "../contexts/AuthContext";
//server
import { prisma } from "../db/prisma";
//interfaces
interface Institution {
  id: number;
  name: string;
  emailFormat?: string;
  authForm: string;
}
interface FormData {
  name: string;
  email: string;
  password: string;
  institutionName: string;
  institutionPassword?: string;
}

export default function Register({
  institutions,
}: {
  institutions: Institution[];
}) {
  //contexts
  const { logIn } = useAuth();
  const router = useRouter();
  //query
  const registerMutation = useMutation(
    (formData: any) => {
      return axios({
        method: "POST",
        url: "/api/user",
        data: formData,
      });
    },
    {
      onSuccess: (data: any) => {
        logIn(data.data.token);
        router.push("/");
      },
      onError: (error: any) => {
        if (error.response.status === 401) {
          setGlobalError("Heslo instituce není správné!");
        } else {
          setGlobalError("Něco se pokazilo!");
        }
      },
    }
  );
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const selectInstitution = (item: string) => {
    institutions.forEach((institution) => {
      if (institution.name === item) {
        setInstitution(institution);
      }
    });
  };

  const submitRegistration = (e) => {
    e.preventDefault();
    setGlobalError(null);
    let formData = Object.fromEntries(new FormData(e.target));
    formData = {
      ...formData,
      institutionName: institution.name,
    };
    const nameRegex = new RegExp("^.{1,}[ ].{1,}$");
    if (!nameRegex.test(formData.name.toString())) {
      return setGlobalError("Zadej prosím své jméno a příjmení!");
    }
    if (
      formData.password.toString().length < 5 ||
      formData.password.toString().length > 30
    ) {
      return setGlobalError("Heslo musí mít mezi 5 až 30 znaky!");
    }
    if (formData.password !== formData.passwordConfirm) {
      return setGlobalError("Hesla se neshodují!");
    }
    if (institution.authForm === "email") {
      const regex = new RegExp(institution.emailFormat);
      const valid = regex.test(formData.email.toString());
      if (!valid) {
        return setGlobalError("Heslo se neshoduje s požadavky instituce!");
      }
    }
    //The formatData object will be sent to the server - we don't want password confirmation sent to the server
    delete formData.passwordConfirm;
    console.log(formData);
    registerMutation.mutate(formData);
  };

  return (
    <>
      <Head>
        <title>Registrace | PatronBox</title>
      </Head>
      <AuthLayout>
        <form onSubmit={submitRegistration}>
          <Notification severity="error" message={globalError} />
          <h2>Registrace</h2>
          <section>
            <Dropdown
              name="Instituce"
              onChange={selectInstitution}
              items={
                institutions.length
                  ? institutions.map((institution) => institution.name)
                  : []
              }
            ></Dropdown>
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
            {institution?.authForm === "password" && (
              <input
                name="institutionPassword"
                required
                type="password"
                placeholder="Heslo instituce..."
              />
            )}
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
          <button
            className={`btn main ${
              registerMutation.isLoading ? "loading" : ""
            }`}
          >
            {registerMutation.isLoading ? <ThreeDots /> : "Registrovat"}
          </button>
        </form>
        <Link href={"/login"}>
          <a>Již mám účet...</a>
        </Link>
      </AuthLayout>
    </>
  );
}

export const getServerSideProps = async () => {
  const institutions = await prisma.institution.findMany({
    select: {
      id: true,
      name: true,
      authForm: true,
      emailFormat: true,
    },
  });
  return {
    props: {
      institutions,
    },
  };
};
