import { useAuth } from "./AuthContext";

export function AuthPanel() {
  const { identity } = useAuth();

  return (
    <nav>
      {identity ? (
        <a href="logout">Log out...</a>
      ) : (
        <>
          <a href="register">Sign up...</a>
          <a href="login">Log in...</a>
        </>
      )}
    </nav>
  );
}
