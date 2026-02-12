"use client";
import { useState, useEffect, useRef } from "react";
import { formatTime } from "../utils/formatTime";

export default function Timer({ onTimeUpdate }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Handle interval
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  // 🔥 SAFE: Notify parent when seconds changes
  useEffect(() => {
    onTimeUpdate(seconds);
  }, [seconds, onTimeUpdate]);

  const handleReset = () => {
    setRunning(false);
    setSeconds(0);
  };

  return (
    <div>
      <h2>Match Timer: {formatTime(seconds)}</h2>

      <button onClick={() => setRunning(true)}>
        Start
      </button>

      <button onClick={() => setRunning(false)}>
        Pause
      </button>

      <button onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
