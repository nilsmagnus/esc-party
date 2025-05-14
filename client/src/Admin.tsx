import { useEffect, useState } from "react";
import { Country, fetchVotes } from "./MyVote.tsx";
import { EscScore } from "./PartySummary.tsx";
import { fetchScores } from "./EscResults.tsx";
import { apiUrl } from "./Welcome.tsx";

export default function AdminPage() {
  const [lineup, setLineup] = useState<Country[]>([]);
  const [score, setScore] = useState<EscScore[]>([]);
  const refresh = () => {
    fetchVotes().then((r) => setLineup(r.lineup));
    fetchScores().then((s) => setScore(s.scores));
  };

  useEffect(() => {
    refresh();
  }, [1]);

  function increase(code: string): void {
    postDelta(code, 1).then(() => refresh());
  }
  function decrease(code: string): void {
    postDelta(code, -1).then(() => refresh());;
  }

  function findScore(
    code: string,
    score: EscScore[],
  ): import("react").ReactNode {
    const found = score.find((s) => s.countryCode == code);
    if (found) {
      return <div>{found.score}</div>;
    } else return <div>0</div>;
  }

  return (
    <div>
      <h1>Admin</h1>
      Lineup
      <ul>
        {lineup.map((l) => (
          <div key={l.code} className="flex flex-row gap-x-2 ">
            {l.country} / {l.song} {findScore(l.code, score)}
            <div
              className="border-2 border-amber-300 px-2 rounded-md"
              onClick={() => increase(l.code)}
            >
              +
            </div>
            <div
              className="border-2 border-amber-700 px-2 rounded-md"
              onClick={() => decrease(l.code)}
            >
              −
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

async function postDelta(countrycode: string, delta: number): Promise<void> {
  const response = await fetch(
    `${apiUrl}/deltascore?delta=${delta}&code=${countrycode}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
