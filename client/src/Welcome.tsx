import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import "./App.css";
import JoinParty from "./JoinParty.tsx";

function Welcome() {
  gsap.registerPlugin(SplitText);

  useGSAP(() => {
    const partyText = new SplitText(".partysplit", { type: "chars" });
    const chars = partyText.chars;

    gsap.from(chars, {
      rotate:360,
      ease:"power1.out",
      yoyo: true,
      yoyoEase:"back.out",
      repeat: -1,
      stagger: {
        amount: 0.5,
        from: "random",
      },
    });
  });

  const createParty = () => {
    console.log("create");
  };
  return (
    <div className="flex flex-col items-center">
      <img src="/logo.png" className="h-72 " alt="Party logo" />

      <h1 className="partysplit">
      🤩 Eurovision Party 🎉  
      </h1>

      <div className="flex flex-col w-full">
        <JoinParty />

        <div className="w-full mt-24 p-8  shadow-amber-700 shadow  rounded-2xl">
          ... or
          <button onClick={(e) => createParty()}>Create new party</button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
