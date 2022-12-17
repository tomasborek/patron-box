import React, { useState } from "react";
//next
import { useRouter } from "next/router";
//interfaces
import { Station, Box } from "../../../../interfaces/interfaces";
interface MutationProps {
  boxId: number;
  length: number;
  selectedStation: Station;
}

interface Props {
  length: number;
  selectedStation: Station | null;
  notify: (severity: string, message: string) => void;
  createReservation: ({
    boxId,
    selectedStation,
    length,
  }: MutationProps) => void;
}
export default function Summary({
  length,
  selectedStation,
  notify,
  createReservation,
}: Props) {
  //state
  const [usedBox, setUsedBox] = useState<Box | null>(null);
  const router = useRouter();
  //functions
  const submit = () => {
    if (!selectedStation) return notify("error", "Vyberte prosím stanici");
    if (!length) return notify("error", "Zadejte prosím délku rezervace");
    const validBox: Box | undefined = selectedStation.boxes.filter(
      (box: Box) => box.reservation === null
    )[0];
    if (!validBox) return notify("error", "Tato stanice není volná");
    setUsedBox(validBox);
    createReservation({
      boxId: validBox.localId,
      selectedStation: selectedStation,
      length,
    });
  };
  return (
    <section>
      <section>
        <p>{length ? `${length} hodin` : `Délka není zvolena.`}</p>
        <h3>0,00Kč</h3>
        <p>{selectedStation ? selectedStation.address : "Žádná stanice"}</p>
      </section>
      <button onClick={submit} className="btn main">
        Dokončit a zaplatit
      </button>
    </section>
  );
}
