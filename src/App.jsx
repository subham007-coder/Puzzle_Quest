import React from "react";
import MemoryGame from "./Components/MemoryGame";

function App() {
  return (
    <div className="bg-slate-900 w-full min-h-screen text-white">
      <h1 style={{ textAlign: "center" }}>Memory Card Game</h1>
      <MemoryGame />
    </div>
  );
}

export default App;
