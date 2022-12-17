import { useRouter } from "next/router";

export const useNotification = (setNotification: any) => {
  return (severity?: string, message?: string) => {
    if (severity && message) setNotification({ severity, message });
    else setNotification(null);
  };
};

export const useParams = (param: string) => {
  const router = useRouter();
  return Array.isArray(router.query[param])
    ? router.query[param][0]
    : router.query[param];
};
