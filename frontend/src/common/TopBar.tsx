import { useAuth } from "../auth/AuthContext";
import styles from "./TopBar.module.css";
import { useMe } from "./use-me";

export function TopBar() {
  const { identity, setIdentity } = useAuth();
  const me = useMe();

  return (
    <header className={styles.bar}>
      <h1>Cloud P1</h1>
      {identity ? (
        <nav className={styles.panel}>
          <button onClick={() => setIdentity(null)}>
            Logout {me ? `(${me.username})` : ""}
          </button>
        </nav>
      ) : null}
    </header>
  );
}
