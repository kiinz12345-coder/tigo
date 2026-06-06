"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
export default function Timer({ onTimeUpdate, isActive, sessionId, partner }) {
  const [seconds, setSeconds] = useState(0);
  const socket = useSocket();
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        const newSec = prev + 1;
        onTimeUpdate(newSec);
        return newSec;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
      if (sessionId && seconds > 0) socket?.emit("end-call", { sessionId, durationSecs: seconds });
    };
  }, [isActive, sessionId]);
  const freeSecs = Math.max(0, 20 - seconds);
  const paidSecs = Math.max(0, seconds - 20);
  const creditsUsed = Math.ceil(paidSecs / 60) * 3;
  return (
    <div className="mt-2 text-center">
      <p>Duration: {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</p>
      {freeSecs > 0 && <p className="text-green-500">{freeSecs}s free remaining</p>}
      {paidSecs > 0 && <p className="text-red-500">Charging {creditsUsed} credits/min</p>}
    </div>
  );
}
