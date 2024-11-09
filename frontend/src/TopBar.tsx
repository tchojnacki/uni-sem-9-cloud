import { useAuth } from "./AuthContext";

export function TopBar() {
  const { identity, logOut } = useAuth();

  return (
    <header className="bar">
      <h1>Cloud P1</h1>
      {identity ? (
        <nav>
          <button onClick={logOut}>Logout</button>
        </nav>
      ) : null}
    </header>
  );
}
