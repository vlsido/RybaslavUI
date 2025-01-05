import { Image, StyleSheet, View } from "react-native";

function Avatar() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.container}
        source={require("../../../assets/images/defaultAvatarImage.png")}
      />
    </View>
  );
}

export default Avatar;

const styles = StyleSheet.create({
  container: {
    height: 36,
    width: 36,
    borderRadius: 60,
  }
})
