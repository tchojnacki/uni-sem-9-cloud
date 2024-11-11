import { Users } from "./Users";
import { Chat } from "./Chat";
import { useState } from "react";

export function Messaging() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="layout">
      <Users selectedId={selectedId} setSelectedId={setSelectedId} />
      <Chat selectedId={selectedId} />
    </div>
  );
}
