import { FormEvent, useCallback, useEffect, useState } from "react";
import { useApi } from "../common/api";
import styles from "./Chat.module.css";
import { Message } from "./Message";

type Account = {
  id: string;
  username: string;
};

type Message = {
  id: string;
  time: string;
  sender: string;
  receiver: string;
  content: string;
};

type ChatProps = {
  selectedId: string | null;
};

export function Chat({ selectedId }: ChatProps) {
  const { get, post } = useApi();

  const [content, setContent] = useState("");
  const [me, setMe] = useState<Account | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    get("/accounts/me").then((res) => setMe(res));
  }, [get]);

  useEffect(() => {
    if (selectedId === null) {
      return;
    }
    get(`/messages/${selectedId}`).then((res) => setMessages(res));
  }, [selectedId, get]);

  const handleSend = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (selectedId === null) {
        return;
      }
      setContent("");
      post("/messages", { receiver: selectedId, content }).then((res) =>
        setMessages((prev) => [...prev, res])
      );
    },
    [selectedId, content, post]
  );

  if (me === null || selectedId === null) {
    return <main className={styles.chat}></main>;
  }

  return (
    <main className={styles.chat}>
      <h2>Chat</h2>
      <section className={styles.messages}>
        {messages.map((m) => (
          <Message
            key={m.id}
            time={m.time}
            isMine={m.sender === me.id}
            content={m.content}
          />
        ))}
      </section>
      <form className={styles.send} onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button disabled={content.length === 0} type="submit">
          Send
        </button>
      </form>
    </main>
  );
}
