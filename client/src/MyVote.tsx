import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import confetti from "canvas-confetti";

import { gsap } from "gsap";
import { apiUrl } from "./Welcome.tsx";

export default function MyVote() {
  const [myRanking, setMyRanking] = useState<Ranking[]>([]);
  const [lineup, setLineup] = useState<Country[]>([]);
  const [isVotingOpen, setIsVotingOpen] = useState(true);
  const [optionsArray, setOptionsArray] = useState(
    Array.from({ length: 37 }, (_, index) => index + 1),
  );

  useEffect(() => {
    fetchVotes().then((r) => {
      setMyRanking(r.myranking);
      setLineup(r.lineup);
      setIsVotingOpen(r.isVotingOpen);
    });
  }, []);

  function animateUp(countryCode: string) {
    confetti({
      shapes: ["star"],
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    gsap.to(`.${countryCode}`, {
      stagger: -0.4,
      x: 150,
      y: 20,
      rotation: -720,
      duration: 0.5,
      repeat: 1,
      yoyo: true,
      scale: 8.0,
    });
  }

  function animateDown(countryCode: string) {
    gsap.to(`.${countryCode}`, {
      rotation: -720,
      duration: 0.5,
      scale: 0.3,
      yoyo: true,
      repeat: 1,
    });
  }

  const addVote = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedObject = JSON.parse(selectedValue);
    postRank(selectedObject.country, selectedObject.rank).then(() => {
      fetchVotes().then((r) => {
        setMyRanking(r.myranking);
        setLineup(r.lineup);
        setIsVotingOpen(r.isVotingOpen);
      });

      setTimeout(() => {
        animateUp(selectedObject.country);
      }, 100);
    });
  };

  const voteUp = (countryCode: string) => {
    postUpVote(countryCode)
      .then(() => fetchVotes())
      .then((r) => {
        setMyRanking(r.myranking);
        setLineup(r.lineup);
        setIsVotingOpen(r.isVotingOpen);
      })
      .then(() => animateUp(countryCode));
  };

  const voteDown = (countryCode: string) => {
    animateDown(countryCode);
    postDownVote(countryCode).then(() =>
      fetchVotes().then((r) => {
        setMyRanking(r.myranking);
        setLineup(r.lineup);
        setIsVotingOpen(r.isVotingOpen);
      })
    );
  };

  useEffect(() => {
    const newOptions = optionsArray.filter((v) =>
      myRanking.find((myr) => myr.rank === v) === undefined
    );
    setOptionsArray(newOptions);
  }, [myRanking]);

  return (
    <div>
      {myRanking.length > 0 && (
        <div>
          <h2>Dine stemmer 📈</h2>
          <table>
            <tbody>
              {myRanking.map((rank) => {
                return (
                  <tr key={rank.countryCode}>
                    <td>
                      <div className="">
                        <div className={rank.countryCode}>{rank.rank}</div>
                      </div>
                    </td>
                    <td>
                      <div className={rank.countryCode}>
                        {getCountryFlagEmoji(rank.countryCode)}
                      </div>
                    </td>
                    <td>{rank.country}</td>
                    <td>{rank.song}</td>
                    <td className="flex flex-row space-x-1">
                      {isVotingOpen && rank.rank < 37 &&
                        (
                          <div
                            className="rounded-md bg-gray-400 px-2 cursor-pointer"
                            onClick={() => voteDown(rank.countryCode)}
                          >
                            ↓
                          </div>
                        )}
                      {isVotingOpen && rank.rank > 1 &&
                        (
                          <div
                            className=" rounded-md bg-gray-400 px-2 cursor-pointer"
                            onClick={() => voteUp(rank.countryCode)}
                          >
                            ↑
                          </div>
                        )}
                    </td>
                    <td>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      
    </div>
  );
}

interface MyVotes {
  isVotingOpen: boolean;
  lineup: Country[];
  myranking: Ranking[];
}

interface Ranking {
  countryCode: string;
  rank: number;
  song: string;
  country: string;
}

export interface Country {
  code: string;
  country: string;
  song: string;
}

export const getCountryFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

function postRank(countryCode: string, rank: number): Promise<void> {
  const userid = localStorage.getItem("userid");
  const party = localStorage.getItem("party");
  return fetch(`${apiUrl}/myvote?rank=${rank}&country=${countryCode}&userid=${userid}&party=${party}`, {
    method: "POST",
    credentials: "include",
  }).then((r) => {
    console.log(r.status);
  });
}

export function fetchVotes(): Promise<MyVotes> {
  const userid = localStorage.getItem("userid");
  const party = localStorage.getItem("party");
  return fetch(
    `${apiUrl}/myvote?userid=${userid}&party=${party}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then((e) => {
    return e.json() as Promise<MyVotes>;
  });
}

function postUpVote(countryCode: string): Promise<void> {
  const userid = localStorage.getItem("userid");
  const party = localStorage.getItem("party");

  console.log("up with", countryCode);
  return fetch(
    `${apiUrl}/upvote?c=${countryCode}&userid=${userid}&party=${party}`,
    { method: "POST", credentials: "include" },
  ).then((r) => {
    if (!r.ok) console.log("upvote failed");
  });
}

function postDownVote(countryCode: string) {
  console.log("down with", countryCode);
  const userid = localStorage.getItem("userid");
  const party = localStorage.getItem("party");

  return fetch(
    `${apiUrl}/downvote?c=${countryCode}&userid=${userid}&party=${party}`,
    { method: "POST", credentials: "include" },
  ).then((r) => {
    if (!r.ok) console.log("upvote failed");
  });
}
