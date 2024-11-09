import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import * as cognito from "./cognito";
import { err, ok, Result } from "../common/Result";

type Identity = { accessToken: string; refreshToken: string } | null;
type AuthData = {
  identity: Identity;
  signUp: (
    email: string,
    username: string,
    password: string
  ) => Promise<Result<null, string>>;
  logIn: (username: string, password: string) => Promise<Result<null, string>>;
  logOut: () => void;
};

const AuthContext = createContext<AuthData>({
  identity: null,
  signUp: async () => err("Not implemented"),
  logIn: async () => err("Not implemented"),
  logOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [identity, setIdentity] = useState<Identity>(null);

  const signUp = useCallback(
    (
      email: string,
      username: string,
      password: string
    ): Promise<Result<null, string>> => {
      return cognito.signUp(email, username, password);
    },
    []
  );

  const logIn = useCallback(
    async (
      username: string,
      password: string
    ): Promise<Result<null, string>> => {
      const result = await cognito.logIn(username, password);
      if (result.tag === "err") {
        return result;
      }
      setIdentity(result.ok);
      return ok(null);
    },
    []
  );

  const logOut = useCallback(() => setIdentity(null), []);

  return (
    <AuthContext.Provider value={{ identity, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
