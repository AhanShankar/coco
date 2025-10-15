import createUDPServer from "@/utils/udp";
import React, { useEffect, useRef, useState } from "react";
import { Button, View } from "react-native";
import CameraFeed from "../components/ui/CameraFeed";
import WeatherApp from "../components/ui/WeatherApp";

export default function Home() {
  const [showAlt, setShowAlt] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowAlt(false), 2000);
  };
  useEffect(() => {
    const server = createUDPServer((msg: Buffer) => {
      setShowAlt(true);
      resetHideTimer();
    });
    return () => {
      console.log("Closing UDP server");
      server.close();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
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