import PartySummary from "./PartySummary.tsx";
import MyVote from "./MyVote.tsx";

export default function PartyPage() {
    return (
      <div className="flex flex-col">
        <MyVote />
        <PartySummary />
      </div>
    )

}