import PartySummary from "./PartySummary.tsx";
import MyVote from "./MyVote.tsx";
import EscResults from "./EscResults.tsx";
import { useEffect } from "react";


export default function PartyPage() {
  const reload = ()=>{
    setTimeout(() => {
      location.reload();
      reload();
    }, 60000);
  }
  useEffect(()=>{
    reload();
  }, [])
  return (
    <div className="flex flex-col space-y-12">
      <PartySummary />
      <MyVote />
      <EscResults />
    </div>
  );
}
