import { useEffect, useState } from "react";
import { useApi } from "../common/api";
import { AccountDto } from "../common/types";
import { useMe } from "../common/use-me";
import styles from "./Users.module.css";

type UsersProps = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

function useAccounts(): AccountDto[] | null {
  const { get } = useApi();
  const [accounts, setAccounts] = useState<AccountDto[] | null>([]);

  useEffect(() => {
    get<AccountDto[]>("/accounts").then((res) => setAccounts(res));
  }, [get]);

  return accounts;
}

export function Users({ selectedId, setSelectedId }: UsersProps) {
  const accounts = useAccounts();
  const me = useMe();

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
