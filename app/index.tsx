import createUDPServer from "@/utils/udp";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import CameraFeed from "../components/ui/CameraFeed";
import WeatherApp from "../components/ui/WeatherApp";
const CAMERA_FEED_TIMER = 30 * 1000
export default function Home() {
  const [showAlt, setCameraFeed] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setCameraFeed(false), CAMERA_FEED_TIMER);
  };
  useEffect(() => {
    const server = createUDPServer((msg: Buffer) => {
      setCameraFeed(true);
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
      {showAlt ? <CameraFeed /> : <WeatherApp />}
    </View>
  );
}