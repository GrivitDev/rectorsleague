"use client";
import { useState, useEffect, useRef } from "react";
import { formatTime } from "../utils/formatTime";

/**
 * @param {{ onTimeUpdate: (seconds: number) => void }} props
 */
export default function Timer({ onTimeUpdate }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

   
  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; };
  }, [intervalRef, running]);

  useEffect(() => onTimeUpdate(seconds), [seconds, onTimeUpdate]);

  const handleReset = () => { setRunning(false); setSeconds(0); if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; };

  return (
    <div>
      <h2>Match Timer: {formatTime(seconds)}</h2>
      <button onClick={() => setRunning(true)}>Start</button>
      <button onClick={() => setRunning(false)}>Pause</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
