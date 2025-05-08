// App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Welcome from "./Welcome.tsx";
import PartyPage from "./PartyPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/party/:code" element={<PartyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
