import { useAuth } from "./auth/AuthContext";
import { LoginPage } from "./auth/LoginPage";
import { TopBar } from "./common/TopBar";
import { Messaging } from "./chat/Messaging";
import styles from "./App.module.css";

export function App() {
  const { identity } = useAuth();

  return (
    <div className={styles.container}>
      <TopBar />
      {identity ? <Messaging /> : <LoginPage />}
    </div>
  );
}
