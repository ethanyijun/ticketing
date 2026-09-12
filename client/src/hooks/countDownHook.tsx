import { useState, useEffect } from "react";

const calculateTimeLeft = (expiresAt?: string) => {
  if (!expiresAt) return 0;
  return Math.max(
    0,
    Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000)
  );
};

export const useCountdown = (expiresAt?: string, status?: string) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(expiresAt)
  );

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(expiresAt));

    if (!expiresAt || status === "complete") return;

    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt, status]);

  return timeLeft;
};
