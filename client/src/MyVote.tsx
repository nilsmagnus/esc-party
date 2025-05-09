import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export default function MyVote() {
  const [myRanking, setMyRanking] = useState<Ranking[]>([]);
  const [lineup, setLineup] = useState<Country[]>([]);
  const [optionsArray, setOptionsArray] = useState(
    Array.from({ length: 37 }, (_, index) => index + 1),
  );

  useEffect(() => {
    fetchVotes(setLineup, setMyRanking);
  }, []);

  const addVote = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedObject = JSON.parse(selectedValue);
    postRank(selectedObject.country, selectedObject.rank).then(() =>
      fetchVotes(setLineup, setMyRanking)
    );
  };

  const voteUp = (countryCode: string) => {
    postUpVote(countryCode).then(() => fetchVotes(setLineup, setMyRanking));
  };

  const voteDown = (countryCode: string) => {
    postDownVote(countryCode).then(() => fetchVotes(setLineup, setMyRanking));
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
          <h2>Din rangering 📈</h2>
          <table>
            <tbody>
              {myRanking.map((rank) => {
                return (
                  <tr key={rank.countryCode}>
                    <td>
                      <div className=" pl-3 font-bold  text-lg">
                        {rank.rank}
                      </div>
                    </td>
                    <td>{getCountryFlagEmoji(rank.countryCode)}</td>
                    <td>{rank.country}</td>
                    <td>{rank.song}</td>
                    <td className="flex flex-row space-x-1">
                      {rank.rank < 37 &&
                        (
                          <div
                            className="rounded-md bg-gray-800 pl-1 pr-1 cursor-pointer"
                            onClick={() => voteDown(rank.countryCode)}
                          >
                            ↓
                          </div>
                        )}
                      {rank.rank > 1 &&
                        (
                          <div
                            className=" rounded-md bg-gray-800 pl-1 pr-1 cursor-pointer"
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

      {optionsArray.length > 0 && (
        <div>
          <h2>Sanger du ikke har rangert 🫣</h2>

          {lineup.length > 0 &&
            (
              <table>
                <tbody>
                  {lineup.map((country) => {
                    return (
                      <tr key={country.code}>
                        <td>{getCountryFlagEmoji(country.code)}</td>
                        <td>{country.country}</td>
                        <td>{country.song}</td>
                        <td>
                          <select value="" onChange={addVote}>
                            <option>-</option>
                            {optionsArray.map((rank) => (
                              <option
                                key={rank}
                                value={JSON.stringify({
                                  "rank": rank,
                                  "country": country.code,
                                })}
                              >
                                {rank}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      )}
    </div>
  );
}

interface MyVotes {
  lineup: Country[];
  myranking: Ranking[];
}

interface Ranking {
  countryCode: string;
  rank: number;
  song: string;
  country: string;
}

interface Country {
  code: string;
  country: string;
  song: string;
}

const getCountryFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

const apiUrl = import.meta.env.API_URL || "http://localhost:8089";

function postRank(countryCode: string, rank: number): Promise<void> {
  return fetch(`${apiUrl}/myvote?rank=${rank}&country=${countryCode}`, {
    method: "POST",
    credentials: "include",
  }).then((r) => {
    console.log(r.status);
  });
}

function fetchVotes(
  setLineup: Dispatch<SetStateAction<Country[]>>,
  setMyRankings: Dispatch<SetStateAction<Ranking[]>>,
) {
  fetch(
    `${apiUrl}/myvote`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then((e) => {
    if (e.ok) {
      return e.json() as Promise<MyVotes>;
    }
  }).then((r) => {
    if (r) {
      setLineup(r.lineup);
      setMyRankings(r.myranking);
    }
  });
}

function postUpVote(countryCode: string): Promise<void> {
  console.log("up with", countryCode);
  return fetch(
    `${apiUrl}/upvote?c=${countryCode}`,
    { method: "POST", credentials: "include" },
  ).then((r) => {
    if (!r.ok) console.log("upvote failed");
  });
}

function postDownVote(countryCode: string) {
  console.log("down with", countryCode);
  return fetch(
    `${apiUrl}/downvote?c=${countryCode}`,
    { method: "POST", credentials: "include" },
  ).then((r) => {
    if (!r.ok) console.log("upvote failed");
  });
}
