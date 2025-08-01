import { FormEvent, useCallback, useState } from "react";
import { useAuth } from "./AuthContext";
import { cognitoLogIn, cognitoSignUp } from "./cognito";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [alert, setAlert] = useState("");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const enabled =
    username.length > 0 &&
    password.length > 0 &&
    (isLogin || (email.length > 0 && confirm.length > 0));

  const { setIdentity } = useAuth();

  const handleLogIn = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setAlert("");
      cognitoLogIn(username, password)
        .then((result) => setIdentity(result))
        .catch((error) => setAlert(error.message));
    },
    [username, password]
  );

  const handleSignUp = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setAlert("");
      if (password !== confirm) {
        setAlert("Passwords do not match.");
        return;
      }
      cognitoSignUp(email, username, password)
        .then(() => {
          setIsLogin(true);
          setEmail("");
          setConfirm("");
          setAlert("Please confirm your email address.");
        })
        .catch((error) => setAlert(error.message));
    },
    [email, username, password, confirm]
  );

  return (
    <div className={styles.auth}>
      <h2>{isLogin ? "Log in" : "Sign up"}</h2>
      <form onSubmit={isLogin ? handleLogIn : handleSignUp}>
        {isLogin ? null : (
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isLogin ? null : (
          <input
            type="password"
            placeholder="Confirm"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        )}
        <button type="submit" disabled={!enabled}>
          {isLogin ? "Log in" : "Sign up"}
        </button>
      </form>
      <p className={styles.context}>
        {isLogin ? "No account?" : "Already have an account?"}{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsLogin((p) => !p);
            setEmail("");
            setConfirm("");
            setAlert("");
          }}
        >
          {isLogin ? "Sign up" : "Log in"}
        </a>{" "}
        instead...
      </p>
      {alert.length > 0 ? <div className={styles.alert}>{alert}</div> : null}
    </div>
  );
}
