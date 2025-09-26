import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CameraFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Camera Feed component!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
  },
  text: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
});
