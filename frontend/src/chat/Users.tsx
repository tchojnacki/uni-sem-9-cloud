import { useEffect, useState } from "react";
import { useApi } from "../common/api";

type Account = { id: string; username: string };

type UsersProps = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export function Users({ selectedId, setSelectedId }: UsersProps) {
  const { get } = useApi();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [me, setMe] = useState<Account | null>(null);

  useEffect(() => {
    get("/accounts").then((res) => setAccounts(res));
    get("/accounts/me").then((res) => setMe(res));
  }, [get]);

  if (!me || !accounts) {
    return (
      <aside className="users">
        <h2>Loading...</h2>
      </aside>
    );
  }

  return (
    <aside className="users">
      <h2>Users</h2>
      <ul>
        {accounts.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => setSelectedId(a.id)}
              className={a.id === selectedId ? "active" : ""}
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
