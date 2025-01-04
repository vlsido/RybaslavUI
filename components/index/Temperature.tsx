import { atom, useAtom } from "jotai";
import { ThemedText } from "../other/ThemedText";
import { useEffect } from "react";

const temperatureAtom = atom<number>(0);

function Temperature() {
  const [temperature, setTemperature] = useAtom(temperatureAtom);

  async function fetchTemperature() {
    try {
      const response = await fetch(
        "http://192.168.0.106:8080/temperature",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      setTemperature(data.temperature);
    } catch (error) {
      console.error("Error fetching temp", error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(fetchTemperature, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // useEffect(() => {
  //   console.log("Tempchanged", temperature);
  // }, [temperature]);

  return (
    <ThemedText>Temperature {temperature.toFixed(2)} °C</ThemedText>
  );
}

export default Temperature;

