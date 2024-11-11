import { FormEvent, useCallback, useEffect, useState } from "react";
import { useApi } from "../common/api";

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
      post("/messages", { receiver: selectedId, content });
    },
    [selectedId, content, post]
  );

  if (me === null || selectedId === null) {
    return <main className="chat"></main>;
  }

  return (
    <main className="chat">
      <h2>Chat</h2>
      <section className="messages">
        {messages.map((m) => (
          <div key={m.id}>
            {m.content} {m.time} {String(m.sender === me.id)}
          </div>
        ))}
      </section>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
