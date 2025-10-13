import createUDPServer from "@/utils/udp";
import React, { useEffect, useState } from "react";
import { Button, View } from "react-native";
import CameraFeed from "../components/ui/CameraFeed";
import WeatherApp from "../components/ui/WeatherApp";

export default function Home() {
  const [showAlt, setShowAlt] = useState(false);
  useEffect(() => {
    const server = createUDPServer((msg: Buffer) => {
      setShowAlt(true);
    });
    return () => {
      console.log("Closing UDP server");
      server.close();
    };
  }, []);
  
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