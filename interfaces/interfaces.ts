export interface User {
  id: number;
  name: string;
  email: string;
  verified: boolean;
  reservations: any;
  admin: boolean;
  institution: Institution | null;
  institutionId: number | null;
}

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  token: string;
  admin: boolean;
}

export interface Alert {
  severity: string;
  message: string;
}

export interface Institution {
  id: number;
  name: string;
  stations: Station[];
}

export interface Station {
  id: number;
  address: string;
  institution: Institution;
  institutionId: number;
  boxes: Box[];
}

export interface Box {
  id: number;
  localId: number;
  station: Station;
  stationId: number;
  reservation: any | null;
  reservationId: number | null;
  available: boolean;
}

export interface Reservation {
  id: number;
  user: User;
  userId: number;
  box: Box;
  boxId: number;
  length: number;
  startTime: Date;
  endTime: Date;
}

export interface Record {
  id: number;
  reservationId: number;
  userId: number;
  stationId: number;
  length: number;
  startTime: Date;
  opened: OpenRecord[];
}

interface OpenRecord {
  id: number;
  time: Date;
  record: Record;
  referenceId: number;
}
