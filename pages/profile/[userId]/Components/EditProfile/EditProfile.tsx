import React, { useState } from "react";
//styles
import styles from "./EditProfile.module.scss";
//components
import Modal from "../../../../../components/Modal/Modal";
import Loading from "../../../../../components/Loading/Loading";
import Notification from "../../../../../components/Notification/Notification";
//hooks
import { useGetProfile } from "../../../../../hooks/queryHooks";
import { useNotification } from "../../../../../hooks/hooks";
//helpers
import { submitMutation } from "../../../../../utils/helpers";
import { useQueryClient } from "react-query";
//interfaces
import { CurrentUser, User } from "../../../../../interfaces/interfaces";
import { useMutation } from "react-query";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Alert } from "../../../../../interfaces/interfaces";

export default function EditProfile() {
  const { currentUser }: { currentUser: CurrentUser } = useAuth();
  const { userInfo }: { userInfo: User } = useGetProfile();
  const [notification, setNotification] = useState<Alert | null>(null);
  const queryClient = useQueryClient();
  const notify = useNotification(setNotification);
  const connectInstitutionMutation = useMutation(
    ({ name, password }: any) => {
      return axios({
        method: "POST",
        url: `/api/user/${currentUser.id}/institution`,
        data: {
          institution: name,
          password,
        },
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
      });
    },
    {
      onError: () => {
        setInsitutionModal(false);
        notify("error", "Něco se pokazilo.");
      },
      onSuccess: () => {
        queryClient.refetchQueries("userProfile");
        setInsitutionModal(false);
        notify("success", "Instituce přidána");
      },
    }
  );
  const disconnectInstitutionMutation = useMutation(
    () => {
      return axios({
        method: "DELETE",
        url: `/api/user/${currentUser.id}/institution`,
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
      });
    },
    {
      onError: () => notify("error", "Něco se pokazilo"),
      onSuccess: () => {
        queryClient.refetchQueries("userProfile");
        notify("success", "Instituce odebrána");
      },
    }
  );
  //state
  const [institutionModal, setInsitutionModal] = useState<boolean>(false);

  return (
    <>
      <Modal open={institutionModal} setOpen={setInsitutionModal}>
        <header>
          <h2>Přidat instituci</h2>
        </header>
        {!connectInstitutionMutation.isLoading ? (
          <form
            onSubmit={(e) =>
              submitMutation(e, connectInstitutionMutation.mutate, notify)
            }
            className="content"
          >
            <input
              name="name"
              type="text"
              className="input"
              placeholder="Název instituce..."
            />
            <input
              name="password"
              className="input"
              type="password"
              placeholder="Heslo instituce..."
            />
            <div className="actions">
              <button className="btn main">Přidat instituci</button>
            </div>
          </form>
        ) : (
          <Loading />
        )}
      </Modal>
      <div className={styles.edit_profile}>
        <Notification notification={notification} />
        <header>
          <h2>Upravit profil</h2>
        </header>
        <section>
          <div className={styles.item}>
            <p>Jméno: </p>
            <input className="input" type="text" defaultValue={userInfo.name} />
          </div>
          <div className={`${styles.item}`}>
            <p>Intituce:</p>
            {userInfo.institution ? (
              <>
                {disconnectInstitutionMutation.isLoading ? (
                  <Loading />
                ) : (
                  <div className={styles.institution_actions}>
                    <p>{userInfo.institution.name}</p>
                    <i
                      onClick={() => disconnectInstitutionMutation.mutate()}
                      className="fas fa-trash"
                    ></i>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setInsitutionModal(true)}
                className="btn neutral"
              >
                <i className="fas fa-plus"></i> Přidat instituci
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
