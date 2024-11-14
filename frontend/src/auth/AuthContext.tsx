import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type Identity = { accessToken: string; refreshToken: string } | null;
type AuthData = {
  identity: Identity;
  setIdentity: (identity: Identity) => void;
};

const AuthContext = createContext<AuthData>({
  identity: null,
  setIdentity: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [identity, setIdentity] = useState<Identity>(null);

  return (
    <AuthContext.Provider value={{ identity, setIdentity }}>
      {children}
    </AuthContext.Provider>
  );
}
