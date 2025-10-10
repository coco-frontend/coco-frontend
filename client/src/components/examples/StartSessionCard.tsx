import { useState } from "react";
import StartSessionCard from "../StartSessionCard";

export default function StartSessionCardExample() {
  const [hasContext, setHasContext] = useState(false);

  return (
    <StartSessionCard
      onStartSession={() => console.log("Starting session")}
      onSetContext={() => {
        setHasContext(true);
        console.log("Setting context");
      }}
      hasContext={hasContext}
    />
  );
}
