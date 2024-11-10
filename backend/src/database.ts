import { Client } from "@bartlomieju/postgres";

type Account = { id: string; username: string };

export class Database {
  private constructor(private readonly client: Client) {}

  public static async setup(connectionString: string): Promise<Database> {
    const client = new Client(connectionString);
    await client.connect();

    await client.queryObject`
      CREATE TABLE IF NOT EXISTS account (
        id UUID PRIMARY KEY,
        username TEXT NOT NULL
      )`;
    await client.queryObject`
      CREATE TABLE IF NOT EXISTS message (
        id SERIAL PRIMARY KEY,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fk_from UUID REFERENCES account(id),
        fk_to UUID REFERENCES account(id),
        content TEXT NOT NULL
      )`;

    return new Database(client);
  }

  public async upsertAccount({ id, username }: Account): Promise<void> {
    await this.client.queryObject`
      INSERT INTO account (id, username)
      VALUES (${id}, ${username})
      ON CONFLICT DO NOTHING`;
  }

  public async getAccounts(): Promise<Account[]> {
    const { rows } = await this.client
      .queryObject<Account>`SELECT * FROM account`;
    return rows;
  }
}
