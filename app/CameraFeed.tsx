import { LibVlcPlayerView } from "expo-libvlc-player";
import React from "react";
import { StyleSheet, View } from "react-native";
export default function CameraFeed() {
  return (
    <View style={{ aspectRatio: 16 / 9 }}>
      <LibVlcPlayerView
        style={{ height: "100%" }}
        source={process.env.EXPO_PUBLIC_STREAM_URI || ""}
      />
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
