import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { apiUrl } from "./Welcome.tsx";

export default function JoinParty() {

  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const urlCode = searchParams.get("code");

  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState<string>(urlCode ?? "");
  const [nick, setNick] = useState("");

  const { contextSafe } = useGSAP();

  const joinParty = contextSafe(async () => {
    const tween = gsap.to(".good", {
      rotation: 720,
      duration: 2,
      background: "cyan",
      yoyo: true,
      repeat: -1,
    });

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/party/join/${code}?nick=${nick}`,
        {
          method: "GET", // or POST, PUT, etc. depending on your API requirements
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        // If response is successful, redirect using window.location
        confetti({
          shapes: ["star"],
          particleCount: 100,
          spread: 120,
          origin: { y: 1 },
        });
        setTimeout(() => {
          window.location.href = `/party/${code}`;
        }, 200);
      } else {
        // Handle other status codes
        setError(`Failed to join party. Status: ${response.status}`);
      }
    } catch (err) {
      tween.reverse();
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      tween.reverse();
    }
  });

  return (
    <div className=" flex flex-col items-center p-6 mt-8 shadow-emerald-100 shadow rounded-2xl">
      <input
        type="text"
        placeholder="party-code-123-abc"
        className="border-1 rounded p-2 w-3/4"
        onInput={(e) => setCode(e.target?.value ?? "")}
        value={code}
      />
      <input
        type="text"
        placeholder="Navnet ditt"
        className="border-1 rounded p-2 w-3/4 mt-2"
        onInput={(e) => setNick(e.target?.value ?? "")}
      />
      <button
        onClick={joinParty}
        type="button"
        className="good shadow shadow-emerald-100 mt-4"
      >
        Join
      </button>
    </div>
  );
}
