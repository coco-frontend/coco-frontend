import { useState } from "react";
import SessionHeader from "../SessionHeader";

export default function SessionHeaderExample() {
  const [isRecording, setIsRecording] = useState(true);

  return (
    <SessionHeader
      isRecording={isRecording}
      onToggleRecording={() => setIsRecording(!isRecording)}
      onEndSession={() => console.log("Session ended")}
      onBack={() => console.log("Back pressed")}
      duration="05:23"
    />
  );
}
