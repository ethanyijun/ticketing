import { useState, useEffect } from "react";

export const useCountdown = (expiresAt: string, status: string) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.round((new Date(expiresAt).getTime() - new Date().getTime()) / 1000)
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    if (status === "complete") return;
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [timeLeft, status]);

  return timeLeft;
};
