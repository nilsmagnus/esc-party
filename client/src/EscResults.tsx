import { useEffect, useState } from "react";
import { EscScore } from "./PartySummary.tsx";
import { getCountryFlagEmoji } from "./MyVote.tsx";
import { gsap } from "gsap";
import confetti from "canvas-confetti";
import { apiUrl } from "./Welcome.tsx";

export default function EscResults() {
  const [scores, setScores] = useState<EscScore[]>([]);
  const refreshScores = () => {
    fetchScores().then((s) => setScores(s.scores)).then(() => {
      setTimeout(() => {
        gsap.to(`.flagg`, {
          rotate: 360,
          stagger: 0.1,
          scale: 2.0, 
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            confetti({
              particleCount: 500,
              spread: 70,
              origin: { y: 0.6 },
            });
          },
        });
      }, 100);
    });
    setTimeout(() => {
        refreshScores();
    }, 11000);
  };
  useEffect(() => {
    refreshScores();
  }, []);

  return (
    <div>
      {scores.length > 0 && (
        <>
          <div className="flex flex-row">
            <h2>Offisielle resultater</h2>
          </div>
          {scores.map((s) => (
            <div key={s.countryCode} className="flex flex-row my-4">
              <div className={`flagg`}>{s.rank}.</div>
              <div className={`px-4 flagg`}>
                {getCountryFlagEmoji(s.countryCode)}
              </div>

              <div>{s.country}</div> <div className="px-8 flagg">{s.score}</div>
              poeng
            </div>
          ))}
        </>
      )}
    </div>
  );
}


export function fetchScores(): Promise<EscScores> {
  return fetch(
    `${apiUrl}/escscores`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then((e) => {
    return e.json() as Promise<EscScores>;
  });
}

export interface EscScores {
  scores: EscScore[];
}
