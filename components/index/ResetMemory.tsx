import { MaterialIcons } from "@expo/vector-icons";
import { AnimatedPressable } from "../utils/MiscellaneousUtil";
import { useCallback } from "react";
import { StyleSheet } from "react-native";

function ResetMemory() {

  const resetMemory = useCallback(async () => {
    try {
      const response = await fetch(
        "http://0.0.0.0:8080/resetMemory",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok === true) {
        console.log("successful");
      }
    } catch (error) {
      console.error("Error fetching temp", error);
    }
  }, []);

  // TODO: This
  return null;

  return (
    <AnimatedPressable
      onPress={resetMemory}
      style={styles.container}
    >
      <MaterialIcons
        name="restart-alt"
        size={32}
        color={"white"}
      />
    </AnimatedPressable>
  );

}

export default ResetMemory;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "auto",
    bottom: "auto",
    left: 0
  }
});
