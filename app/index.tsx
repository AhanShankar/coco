import React, { useState } from "react";
import { Button, View } from "react-native";
import CameraFeed from "../components/ui/CameraFeed";
import WeatherApp from "../components/ui/WeatherApp";

export default function Home() {
  const [showAlt, setShowAlt] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <Button
        title={showAlt ? "Weather" : "Camera"}
        onPress={() => setShowAlt((prev) => !prev)}
      />
      {showAlt ? <CameraFeed /> : <WeatherApp />}
    </View>
  );
}