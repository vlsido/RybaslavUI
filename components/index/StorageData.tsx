import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../other/ThemedView";
import { ThemedText } from "../other/ThemedText";

interface SpaceInfo {
  capacity: number,
  free: number,
  available: number,
}

const storageAtom = atomWithStorage<SpaceInfo | null>("spaceInfo", null);

function StorageData() {
  const [storage, setStorage] = useAtom<SpaceInfo | null>(storageAtom);

  async function fetchStorageData() {
    try {
      const response = await fetch(
        "http://192.168.0.106:8080/storage",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      const data: SpaceInfo = await response.json();

      setStorage({
        capacity: data.capacity / 1073742000,
        free: data.free / 1073742000,
        available: data.available / 1073742000
      })

    } catch (error) {
      console.error("Error fetching temp", error);
    }
  }

  useEffect(() => {
    fetchStorageData();
  }, []);

  if (storage === null) {
    return null;
  }

  return (
    <ThemedView
      style={styles.container}
    >
      <ThemedText
        style={styles.text}
      >
        {(storage.available).toFixed(0)}GB/{(storage.capacity).toFixed(0)}GB
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
    backgroundColor: "rgba(20, 5, 10, 1)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)"
  },
  text: {
    fontSize: 14
  }
});
