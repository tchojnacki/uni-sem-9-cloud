import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "./api";
import { AccountDto } from "./types";

export function useMe(): AccountDto | null {
  const { get } = useApi();
  const { identity } = useAuth();
  const [me, setMe] = useState<AccountDto | null>(null);

  useEffect(() => {
    get<AccountDto>("/accounts/me").then((res) => setMe(res));
  }, [identity?.accessToken]);

  return me;
}
