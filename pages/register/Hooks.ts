import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../hooks/hooks";
import { Alert } from "../../interfaces/interfaces";
import institution from "../api/institution";

export const useRegister = (setNotification: any) => {
  //contexts
  const { logIn } = useAuth();
  const router = useRouter();
  const notify = useNotification(setNotification);
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
        notify("error", "Něco se pokazilo");
      },
    }
  );

  const submit = (e) => {
    e.preventDefault();
    notify(null);
    let formData = Object.fromEntries(new FormData(e.target));
    const nameRegex = new RegExp("^.{1,}[ ].{1,}$");
    if (!nameRegex.test(formData.name.toString())) {
      return notify("error", "Zadej prosím své jméno a příjmení!");
    }
    if (
      formData.password.toString().length < 5 ||
      formData.password.toString().length > 30
    ) {
      return notify("error", "Heslo musí mít mezi 5 až 30 znaky!");
    }
    if (formData.password !== formData.passwordConfirm) {
      return notify("error", "Hesla se neshodují!");
    }
    //The formatData object will be sent to the server - we don't want password confirmation sent to the server
    delete formData.passwordConfirm;
    registerMutation.mutate(formData);
  };

  return {
    notify,
    submit,
    isLoading: registerMutation.isLoading,
  };
};
