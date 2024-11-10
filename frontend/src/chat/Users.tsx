import { useEffect, useState } from "react";
import { useApi } from "../common/api";

type Account = { id: string; username: string };

export function Users() {
  const { get } = useApi();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    get("/accounts").then((res) => setAccounts(res));
  }, [get]);

  return (
    <aside className="users">
      <h2>Users</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>{account.username}</li>
        ))}
      </ul>
    </aside>
  );
}
