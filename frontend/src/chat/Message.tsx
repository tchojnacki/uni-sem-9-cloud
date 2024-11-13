import styles from "./Message.module.css";

type MessageProps = {
  time: string;
  isMine: boolean;
  content: string;
};

export function Message({ time, isMine, content }: MessageProps) {
  return (
    <p className={styles.message} data-mine={isMine} title={new Date(time).toLocaleTimeString()}>{content}</p>
  );
}
