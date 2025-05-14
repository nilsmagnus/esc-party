import {  useEffect, useState } from "react";

import { gsap } from "gsap";
import { apiUrl } from "./Welcome.tsx";

export default function PartySummary() {
  const [parties, setParties] = useState<Parties | null>(null);
  const party = getCookie("party");

  const refreshParties = (party: string) => {
    fetchParties(party).then((p) => setParties(p)).then(() =>{

      setTimeout(() => {
        gsap.to(".rank", {
          yoyo:true,
          repeat:1,
          x:20,
          stagger:0.1
        });
          
      }, 200);
    }
      
    );

    setTimeout(() => {
      refreshParties(party);
    }, 10000);
    
  };

  useEffect(() => {
    if (party != undefined) {
      refreshParties(party);
    }
  }, []);

  function getPlacementEmoji(i: number): import("react").ReactNode {
    const emojis = ["🥇", "🥈", "🥉"];
    if (i < 3) {
      return <h2>{emojis[i]}</h2>;
    }
    return <div>🙈</div>;
  }

  return (
    <div>
      {parties && parties.partyScores.length > 0 &&
        (
          <div>
            <h2>Party resultater🎉</h2>
            {parties.partyScores.map((p, i) => (
              <div key={`rank-${i}`} className={`rank-${i} rank flex flex-row`}>
                {getPlacementEmoji(i)}{" "}
                <h2>{i + 1}. {p.nick} ({p.points} poeng)</h2>
              </div>
            ))}
          </div>
        )}
      {parties && parties.partyScores.length == 0 &&
        (
          <div>
            <h3>Her er de andre på festen din:</h3>
            <ul className="pl-4">
              {parties.participants.map((p) => (
                <div key={p.nick} className="twirl flex flex-row space-x-4">
                  <h2>{getRandomPartyEmojis()}</h2>
                  <div>{p.nick}</div>
                </div>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}

interface Parties {
  participants: Participant[];
  scores: EscScore[];
  partyScores: RankedParticipant[];
}

interface Participant {
  nick: string;
}

interface RankedParticipant {
  nick: string;
  points: number;
}

export interface EscScore {
  rank: number;
  score: number;
  country: string;
  countryCode: string;
}

function getCookie(name: string): string | undefined {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieValue ? cookieValue.split("=")[1] : undefined;
}


function fetchParties(
  party: string,
): Promise<Parties> {
  return fetch(
    `${apiUrl}/party/${party}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then((e) => {
    return e.json() as Promise<Parties>;
  });
}

function getRandomPartyEmojis(count: number = 1): string {
  const partyEmojis: string[] = [
    "🎉", // party popper
    "🎊", // confetti ball
    "🥳", // partying face
    "🎈", // balloon
    "🎆", // fireworks
    "🎇", // sparkler
    "✨", // sparkles
    "🎂", // birthday cake
    "🍾", // bottle with popping cork
    "🥂", // clinking glasses
    "🍻", // clinking beer mugs
    "💃", // woman dancing
    "🕺", // man dancing
    "🙌", // raised hands
    "👏", // clapping hands
    "🤩", // star-struck
    "🎪", // circus tent
    "🎵", // musical note
    "🎶", // musical notes
    "🎸", // guitar
    "🎷", // saxophone
    "🎺", // trumpet
    "🎤", // microphone
    "🎁", // wrapped gift
  ];

  const safeCount = Math.max(1, Math.min(count, 100));

  let result = "";

  for (let i = 0; i < safeCount; i++) {
    const randomIndex = Math.floor(Math.random() * partyEmojis.length);
    result += partyEmojis[randomIndex];
  }

  return result;
}
