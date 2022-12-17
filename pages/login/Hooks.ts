import axios from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../hooks/hooks";

export const useLogin = (setNotification: any) => {
  const notify = useNotification(setNotification);
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
          return notify("error", "Uživatel s tímto emailem neexistuje.");
        } else if (error.response.status === 401) {
          return notify("error", "Špatné heslo");
        }
        notify("error", "Něco se nepovedlo.");
      },
    }
  );
  const submit = (e) => {
    e.preventDefault();
    notify(null);
    const formData = Object.fromEntries(new FormData(e.target));
    loginMutation.mutate(formData);
  };

  return {
    submit,
    notify,
    isLoading: loginMutation.isLoading,
  };
};
