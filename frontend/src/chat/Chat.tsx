import {
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useApi } from "../common/api";
import { MessageDto } from "../common/types";
import { useMe } from "../common/use-me";
import styles from "./Chat.module.css";
import { Message } from "./Message";

type ChatProps = {
  selectedId: string | null;
};

function useMessages(selectedId: string | null): {
  messages: MessageDto[];
  send: (content: string) => void;
} {
  const { get, post, createSocket } = useApi();
  const [messages, setMessages] = useState<MessageDto[]>([]);

  useEffect(() => {
    if (selectedId === null) {
      return;
    }
    get<MessageDto[]>(`/messages/${selectedId}`).then((res) =>
      setMessages(res)
    );
  }, [selectedId, get]);

  useEffect(() => {
    const socket = createSocket();

    socket.addEventListener("message", (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "new-message") {
          const message = data as MessageDto;
          if (
            [message.sender, message.receiver].includes(selectedId as string)
          ) {
            setMessages((prev) => [...prev, message]);
          }
        }
      } catch {
        // Ignore
      }
    });

    return () => socket.close();
  }, [selectedId, createSocket]);

  const send = useCallback(
    (content: string) => {
      post<MessageDto>("/messages", { receiver: selectedId, content });
    },
    [selectedId, post]
  );

  return { messages, send };
}

function useAutoScroll(dependencies: any[]): RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, dependencies);

  return ref;
}

export function Chat({ selectedId }: ChatProps) {
  const { messages, send } = useMessages(selectedId);
  const boxRef = useAutoScroll([messages]);
  const me = useMe();
  const [content, setContent] = useState("");

  const handleSend = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (selectedId === null) {
        return;
      }
      setContent("");
      send(content);
    },
    [selectedId, content, send]
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
