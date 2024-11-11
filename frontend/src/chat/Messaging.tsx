import { useState } from "react";
import { Users } from "./Users";
import { Chat } from "./Chat";
import styles from "./Messaging.module.css";

export function Messaging() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className={styles.messaging}>
      <Users selectedId={selectedId} setSelectedId={setSelectedId} />
      <Chat selectedId={selectedId} />
    </div>
  );
}
