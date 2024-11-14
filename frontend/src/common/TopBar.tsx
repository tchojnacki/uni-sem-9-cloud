import { useAuth } from "../auth/AuthContext";
import styles from "./TopBar.module.css";

export function TopBar() {
  const { identity, setIdentity } = useAuth();

  return (
    <header className={styles.bar}>
      <h1>Cloud P1</h1>
      {identity ? (
        <nav className={styles.panel}>
          <button onClick={() => setIdentity(null)}>Logout</button>
        </nav>
      ) : null}
    </header>
  );
}
