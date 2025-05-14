import PartySummary from "./PartySummary.tsx";
import MyVote from "./MyVote.tsx";
import EscResults from "./EscResults.tsx";


export default function PartyPage() {
  return (
    <div className="flex flex-col space-y-12">
      <PartySummary />
      <MyVote />
      <EscResults />
    </div>
  );
}
