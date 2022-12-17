import React from "react";
//styles
import styles from "./DataInput.module.scss";
//components
import Dropdown from "../../../../components/Dropdown/Dropdown";
import SearchDropdown from "../../../../components/SearchDropdown/SearchDropdown";
//contexts
//dependencies
//hooks
import { useGetStations } from "../../../../hooks/queryHooks";
//interfaces
import { Station, Box } from "../../../../interfaces/interfaces";
interface Props {
  setSelectedStation: any;
  setLength: (length: number) => void;
}

const DataInput = ({ setSelectedStation, setLength }: Props) => {
  const {
    stations,
    stationsQuery,
  }: { stations: Station[]; stationsQuery: any } = useGetStations();

  //functions
  const selectStation = (address: string) => {
    setSelectedStation(
      stations.filter((station) => station.address === address)[0]
    );
  };
  return (
    <section>
      <section>
        <label>Zvolit stanici</label>
        <SearchDropdown
          items={stations.map((station: Station) => {
            let available: boolean = false;
            station.boxes.forEach((box: Box) => {
              if (!box.reservation) available = true;
            });
            if (available) return station.address;
          })}
          placeholder="Najít stanici..."
          onChange={(item: string) => selectStation(item)}
        />
      </section>
      <section>
        <label>Zvolit délku rezervace</label>
        <Dropdown
          name="Délka"
          onChange={(item) => setLength(parseInt(item.split(" ")[0]))}
          items={[
            "1 hodina",
            "3 hodiny",
            "6 hodin",
            "12 hodin",
            "24 hodin",
            "48 hodin",
            "72 hodin",
          ]}
        />
      </section>
    </section>
  );
};

export default DataInput;
