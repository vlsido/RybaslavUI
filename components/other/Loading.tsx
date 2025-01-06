import {
  ActivityIndicator,
  StyleSheet,
  View
} from "react-native";

function Loading() {
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"yellow"} />
      </View>
    </View>
  )
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "yellow",
    fontFamily: "WallMates",
  },
});
