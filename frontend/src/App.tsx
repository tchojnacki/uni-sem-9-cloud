import { useState } from "react";
import { AuthPanel } from "./AuthPanel";
import { Users } from "./Users";
import { Chat } from "./Chat";

export function App() {
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  return (
    <div className="container">
      <header className="bar">
        <h1>Cloud P1</h1>
        <AuthPanel />
      </header>
      <Users />
      <Chat />
    </div>
  );
}
