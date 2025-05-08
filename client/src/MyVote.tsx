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
          <h1>Min rangering 🥁</h1>
          <table>
            <thead>
              <tr>
                <td>
                </td>
                <td>
                  <i>Land</i>
                </td>
                <td>
                  <i>Sang</i>
                </td>
                <td>
                  <i>Plassering</i>
                </td>
              </tr>
            </thead>
            <tbody>
              {myRanking.map((rank) => {
                return (
                  <tr key={rank.countryCode}>
                    <td>{getCountryFlagEmoji(rank.countryCode)}</td>
                    <td>{rank.countryCode}</td>
                    <td>{rank.song}</td>
                    <td>{rank.rank}</td>
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
          <h1>Sanger du ikke har rangert 🫣</h1>

          {lineup.length > 0 &&
            (
              <table>
                <thead>
                  <tr>
                    <td>
                    </td>
                    <td>
                      <i>Land</i>
                    </td>
                    <td>
                      <i>Sang</i>
                    </td>
                    <td>
                      <i>Plassering</i>
                    </td>
                  </tr>
                </thead>
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
