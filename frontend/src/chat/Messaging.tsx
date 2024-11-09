import { Users } from "./Users";
import { Chat } from "./Chat";

export function Messaging() {
  return (
    <div className="layout">
      <Users />
      <Chat />
    </div>
  );
}
