import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
//interfaces
import { CurrentUser } from "../contexts/AuthContext";
import { Station } from "../interfaces/interfaces";
import { useParams } from "./hooks";

export const useGetStations = () => {
  const { currentUser }: { currentUser: CurrentUser } = useAuth();
  const query = useQuery(
    "stations",
    () => {
      return axios({
        method: "GET",
        url: `/api/station`,
        headers: {
          authorization: currentUser ? `Bearer ${currentUser.token}` : null,
        },
      });
    },
    { enabled: !!currentUser }
  );
  return {
    stations: query.data?.data,
    stationsQuery: query,
  };
};

export const useGetProfile = () => {
  const id: number = Number(useParams("userId"));
  const { currentUser }: { currentUser: CurrentUser } = useAuth();
  const query = useQuery(
    "userProfile",
    () => {
      return axios({
        method: "GET",
        url: `/api/user/${id}`,
        headers: {
          authorization: currentUser ? `Bearer: ${currentUser.token}` : null,
        },
      });
    },
    { enabled: !!currentUser && !!id }
  );

  return {
    userInfo: query.data?.data,
    userQuery: query,
  };
};

export const useGetReservation = () => {
  const reservationId = Number(useParams("id"));
  const { currentUser }: { currentUser: CurrentUser } = useAuth();
  const query = useQuery(
    "reservation",
    () => {
      return axios({
        method: "GET",
        url: `/api/reservation/${reservationId}`,
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
      });
    },
    { enabled: !!currentUser }
  );

  return {
    reservationInfo: query.data?.data,
    reservationQuery: query,
  };
};

export const useGetRecords = () => {
  const { currentUser }: { currentUser: CurrentUser } = useAuth();
  const query = useQuery(
    "records",
    () => {
      return axios({
        method: "GET",
        url: `/api/user/${currentUser.id}/record`,
        headers: { authorization: `Bearer ${currentUser.token}` },
      });
    },
    { enabled: !!currentUser }
  );
  return {
    records: query.data?.data,
    recordsQuery: query,
  };
};
