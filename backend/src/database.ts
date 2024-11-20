import { Client } from "@bartlomieju/postgres";
import { Account, Message } from "./types.ts";
import { AWS_GLOBAL_PEM } from "./config/pem.ts";

export class Database {
  private constructor(private readonly client: Client) {}

  public static async setup(connectionString: string): Promise<Database> {
    const client = new Client({
      options: { connectionString },
      tls: { caCertificates: [AWS_GLOBAL_PEM] },
    });
    await client.connect();

    await client.queryObject`
      CREATE TABLE IF NOT EXISTS account (
        id UUID PRIMARY KEY,
        username TEXT NOT NULL
      )`;
    await client.queryObject`
      CREATE TABLE IF NOT EXISTS message (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sender UUID REFERENCES account(id),
        receiver UUID REFERENCES account(id),
        content TEXT NOT NULL,
        CHECK (sender <> receiver),
        CHECK (length(content) > 0)
      )`;

    return new Database(client);
  }

  public async upsertAccount({ id, username }: Account): Promise<void> {
    await this.client.queryObject`
      INSERT INTO account (id, username)
      VALUES (${id}, ${username})
      ON CONFLICT (id) DO UPDATE SET username = ${username}`;
  }

  public async selectAccounts(): Promise<Account[]> {
    const { rows } = await this.client
      .queryObject<Account>`SELECT * FROM account ORDER BY username`;
    return rows;
  }

  public async insertMessage(
    sender: string,
    receiver: string,
    content: string
  ): Promise<Message> {
    const { rows } = await this.client.queryObject<Message>`
      INSERT INTO message (sender, receiver, content)
      VALUES (${sender}, ${receiver}, ${content})
      RETURNING *`;
    return rows[0];
  }

  public async selectMessages(a1: string, a2: string): Promise<Message[]> {
    const { rows } = await this.client.queryObject<Message>`
      SELECT * FROM message
      WHERE (sender = ${a1} AND receiver = ${a2}) OR (sender = ${a2} AND receiver = ${a1})
      ORDER BY time`;
    return rows;
  }
}
