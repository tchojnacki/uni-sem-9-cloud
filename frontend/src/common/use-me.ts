import { useEffect, useState } from "react";
import { AccountDto } from "./types";
import { useApi } from "./api";

export function useMe(): AccountDto | null {
  const { get } = useApi();
  const [me, setMe] = useState<AccountDto | null>(null);

  useEffect(() => {
    get<AccountDto>("/accounts/me").then((res) => setMe(res));
  }, []);

  return me;
}
