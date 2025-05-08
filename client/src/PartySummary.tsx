import { useEffect, useState } from "react";

export default function PartySummary() {
  const apiUrl = import.meta.env.API_URL || "http://localhost:8089";

  const [parties, setParties] = useState<Parties | null>(null);
  const name = getCookie("name");
  const id = getCookie("id");
  const party = getCookie("party");

  useEffect(() => {
    fetch(
      `${apiUrl}/party/${party}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((e) => {
      if (e.ok) {
        return e.json() as Promise<Parties>;
      }
    }).then((r) => {
      if (r) {
        setParties(r);
      }
    });
  }, []);

  return (
    <div>
      <h1>party on {name}!</h1>
      <h2></h2>

      {parties &&
        (
          <ul>
            {parties.participants.map((p) => <div key={p}>{p}</div>)}
          </ul>
        )}
      <p>
        <small>{party}</small>
      </p>
    </div>
  );
}

interface Parties {
  participants: string[];
}

function getCookie(name: string): string | undefined {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieValue ? cookieValue.split("=")[1] : undefined;
}
