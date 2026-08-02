"use client";

import { useEffect, useState } from "react";

export function LiveClock({ city = "San Francisco" }: { city?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/Los_Angeles",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span>
      <span className="hidden sm:inline">{city} </span>
      {time}
    </span>
  );
}
