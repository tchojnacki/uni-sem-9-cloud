import { useEffect, useState } from "react";
import { useApi } from "../common/api";
import { AccountDto } from "../common/types";
import styles from "./Users.module.css";

type UsersProps = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export function Users({ selectedId, setSelectedId }: UsersProps) {
  const { get } = useApi();
  const [accounts, setAccounts] = useState<AccountDto[] | null>(null);
  const [me, setMe] = useState<AccountDto | null>(null);

  useEffect(() => {
    get<AccountDto[]>("/accounts").then((res) => setAccounts(res));
    get<AccountDto>("/accounts/me").then((res) => setMe(res));
  }, [get]);

  if (!me || !accounts) {
    return (
      <aside className={styles.users}>
        <h2>Loading...</h2>
      </aside>
    );
  }

  return (
    <aside className={styles.users}>
      <h2>Users</h2>
      <ul>
        {accounts.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => setSelectedId(a.id)}
              className={a.id === selectedId ? styles.active : ""}
              disabled={a.id === me.id || a.id === selectedId}
            >
              {a.username}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
