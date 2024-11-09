import { useAuth } from "./auth/AuthContext";
import { LoginPage } from "./auth/LoginPage";
import { TopBar } from "./common/TopBar";
import { Messaging } from "./chat/Messaging";

export function App() {
  const { identity } = useAuth();

  return (
    <div className="container">
      <TopBar />
      {identity ? <Messaging /> : <LoginPage />}
    </div>
  );
}
