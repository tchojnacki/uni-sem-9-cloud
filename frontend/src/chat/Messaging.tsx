import { useState } from "react";
import { Users } from "./Users";
import { Chat } from "./Chat";

export function Messaging() {
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  return (
    <div className="layout">
      <Users />
      <Chat />
    </div>
  );
}
