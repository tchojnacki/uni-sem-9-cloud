import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useApi } from "../common/api";
import { AccountDto, MessageDto } from "../common/types";
import { Message } from "./Message";
import styles from "./Chat.module.css";

type ChatProps = {
  selectedId: string | null;
};

export function Chat({ selectedId }: ChatProps) {
  const { get, post, createSocket } = useApi();
  const [content, setContent] = useState("");
  const [me, setMe] = useState<AccountDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const boxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const socket = createSocket();

    socket.addEventListener("message", (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "new-message") {
          const message = data as MessageDto;
          if (message.sender === selectedId) {
            setMessages((prev) => [...prev, message]);
          }
        }
      } catch {
        // Ignore
      }
    });

    return () => socket.close();
  }, [selectedId, createSocket]);

  useEffect(() => {
    get<AccountDto>("/accounts/me").then((res) => setMe(res));
  }, [get]);

  useEffect(() => {
    if (selectedId === null) {
      return;
    }
    get<MessageDto[]>(`/messages/${selectedId}`).then((res) =>
      setMessages(res)
    );
  }, [selectedId, get]);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (selectedId === null) {
        return;
      }
      setContent("");
      post<MessageDto>("/messages", { receiver: selectedId, content }).then(
        (res) => setMessages((prev) => [...prev, res])
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
      <section className={styles.messages} ref={boxRef}>
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
