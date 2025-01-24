import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../other/ThemedView";
import { ThemedText } from "../other/ThemedText";
import { useSignal } from "@preact/signals-react";
import { serverAddress } from "@/constants/Server";

interface SpaceInfo {
  capacity: number,
  free: number,
  available: number,
}


function StorageData() {
  const storage = useSignal<SpaceInfo | null>(null);

  async function fetchStorageData() {
    try {
      const response = await fetch(
        `http://${serverAddress}/storage`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      const data: SpaceInfo = await response.json();

      storage.value = {
        capacity: data.capacity / 1073742000,
        free: data.free / 1073742000,
        available: data.available / 1073742000
      };

    } catch (error) {
      console.error("Error fetching temp", error);
    }
  }

  useEffect(() => {
    fetchStorageData();
  }, []);

  if (storage.value === null) {
    return null;
  }

  return (
    <ThemedView
      darkColor="rgba(20, 5, 10, 1)"
      lightColor="rgba(20, 5, 10, 1)"
      style={styles.container}
    >
      <ThemedText
        darkColor="rgb(233,234,233)"
        lightColor="rgb(233,234,233)"
        style={styles.text}
      >
        {(storage.value.available).toFixed(0)}GB/{(storage.value.capacity).toFixed(0)}GB
      </ThemedText>
    </ThemedView>
  );
}

export default StorageData;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: "5%",
    borderRadius: 5,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)"
  },
  text: {
    fontSize: 14
  }
});
