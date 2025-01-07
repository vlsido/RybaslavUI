import { atom, useAtom } from "jotai";
import { ThemedText } from "../other/ThemedText";
import { ThemedView } from "../other/ThemedView";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { atomWithStorage } from "jotai/utils";

const temperatureAtom = atomWithStorage<number>("temperature", 0);

const temperatureColorAtom = atom({
  callback: (temp: number) => {
    if (temp <= 45)
      return "green"
    else if (temp > 45 && temp <= 55)
      return "rgba(200, 153, 100, 1)"
    else if (temp > 55 && temp <= 60)
      return "orange"
    else
      return "red"
  }
})

function Temperature() {
  const [temperature, setTemperature] = useAtom(temperatureAtom);
  const [temperatureColor] = useAtom(temperatureColorAtom);

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
    const intervalId = setInterval(fetchTemperature, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ThemedView
      style={styles.container}
      darkColor="rgba(20, 5, 10, 1)"
      lightColor="rgba(20, 5, 10, 1)"
    >
      <ThemedText
        style={[
          {
            color: temperatureColor.callback(temperature),
            fontSize: 14
          }
        ]}
      >
        {temperature.toFixed(2)} °C
      </ThemedText>
    </ThemedView>
  );
}

export default Temperature;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: "5%",
    borderRadius: 5,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)"
  }
});
