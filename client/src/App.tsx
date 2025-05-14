// App.tsx
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Welcome from "./Welcome.tsx";
import PartyPage from "./PartyPage.tsx";
import EscResults from "./EscResults.tsx";
import AdminPage from "./Admin.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/party/:code" element={<PartyPage />} />
        <Route path="/escresults" element={<EscResults />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
