import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../other/ThemedView";
import { ThemedText } from "../other/ThemedText";
import { useSignal } from "@preact/signals-react";
import { useMMKVObject } from "react-native-mmkv";

interface SpaceInfo {
  capacity: number,
  free: number,
  available: number,
}



function StorageData() {
  const [cachedSpaceInfo, setCachedSpaceInfo] = useMMKVObject<SpaceInfo>("storage.spaceinfo");

  const spaceInfo = useSignal<SpaceInfo | null>(cachedSpaceInfo ?? { capacity: 0, free: 0, available: 0 });

  useSignal(() => {
    if (spaceInfo.value !== null) {
      setCachedSpaceInfo(spaceInfo.value);
    }
  });

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

      spaceInfo.value = {
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
        {(spaceInfo.value.available).toFixed(0)}GB/{(spaceInfo.value.capacity).toFixed(0)}GB
      </ThemedText>
    </ThemedView>
  );
}

export default StorageData;

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)"
  },
  text: {
    fontSize: 14
  }
});
