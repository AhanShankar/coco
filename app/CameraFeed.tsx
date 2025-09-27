import { LibVlcPlayerView } from "expo-libvlc-player";
import React from "react";
import { StyleSheet, View } from "react-native";
const mediaOptions = [
  ':network-caching=100',        // Very low cache
  ':live-caching=0',
  ':clock-jitter=200',          // Allow some jitter for stability
  ':rtsp-tcp',
  ':no-audio',                  // Disable audio if not needed
  ':rate=1.1',                  // Slightly faster playback to prevent lag
  ':drop-late-frames',          // Drop frames that arrive late
  ':skip-frames',               // Allow frame skipping
];

export default function CameraFeed() {
  return (
    <View style={{ aspectRatio: 16 / 9 }}>
      <LibVlcPlayerView
        style={{ height: "100%" }}
        source={process.env.EXPO_PUBLIC_STREAM_URI || ""}
        options={mediaOptions}
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
