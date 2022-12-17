import React, { useEffect, useState } from "react";
//styles
import styles from "./Profile.module.scss";
//next
import { useRouter } from "next/router";
//hooks
import { useGetProfile } from "../../../hooks/queryHooks";
//context
import { useAuth } from "../../../contexts/AuthContext";
//layouts
import Layout from "../../../Layouts/Layout/Layout";
import Sidebar from "./Components/Sidebar";
//interfaces
import { CurrentUser } from "../../../contexts/AuthContext";
import Loading from "../../../components/Loading/Loading";
import ProfileInfo from "./Components/ProfileInfo/ProfileInfo";
import Reservations from "./Components/Reservations/Reservations";
import History from "./Components/History/History";
import EditProfile from "./Components/EditProfile/EditProfile";
export default function Profile() {
  const router = useRouter();
  const { userInfo, userQuery } = useGetProfile();
  const [view, setView] = useState<string>("info");
  const { currentUser }: { currentUser: CurrentUser } = useAuth();
  return (
    <Layout>
      {!currentUser || !userInfo ? (
        <Loading />
      ) : (
        <div className={styles.profile}>
          <div className="container">
            <div className={styles.main_box}>
              <Sidebar
                view={view}
                setView={setView}
                items={[
                  {
                    name: "Informace",
                    icon: "user",
                    view: "info",
                  },
                  {
                    name: "Upravit profil",
                    icon: "pen",
                    view: "edit",
                  },
                  {
                    name: "Rezervace",
                    icon: "box",
                    view: "reservations",
                  },
                  {
                    name: "Historie",
                    icon: "clock",
                    view: "history",
                  },
                ]}
              />
              <div className={styles.current_view}>
                {view === "info" ? <ProfileInfo /> : null}
                {view === "reservations" ? <Reservations /> : null}
                {view === "edit" ? <EditProfile /> : null}
                {view === "history" ? <History /> : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
