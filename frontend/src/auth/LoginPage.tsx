import { FormEvent, useCallback, useState } from "react";
import { useAuth } from "./AuthContext";

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

  const { logIn, signUp } = useAuth();

  const handleLogIn = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setAlert("");
      const result = await logIn(username, password);
      if (result.tag === "err") {
        setAlert(result.err);
      }
    },
    [username, password]
  );

  const handleSignUp = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setAlert("");
      if (password !== confirm) {
        setAlert("Passwords do not match!");
        return;
      }
      const result = await signUp(email, username, password);
      if (result.tag === "ok") {
        setIsLogin(true);
        setEmail("");
        setConfirm("");
      } else {
        setAlert(result.err);
      }
    },
    [email, username, password, confirm]
  );

  return (
    <div className="auth">
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
      <p>
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
      {alert.length > 0 ? <div className="alert">{alert}</div> : null}
    </div>
  );
}
