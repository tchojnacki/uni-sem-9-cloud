import { useState } from "react";
import { Users } from "./Users";
import { Chat } from "./Chat";
import { useAuth } from "./AuthContext";
import { LoginPage } from "./LoginPage";
import { TopBar } from "./TopBar";

export function App() {
  const { identity } = useAuth();
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  return (
    <div className="container">
      <TopBar />
      {identity ? (
        <div className="layout">
          <Users />
          <Chat />
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
