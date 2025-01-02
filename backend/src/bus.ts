import { createClient } from "redis";
import { Message } from "./types.ts";

type Client = ReturnType<typeof createClient>;

export class Bus {
  private constructor(private readonly client: Client) {}

  public static async setup(connectionString: string): Promise<Bus> {
    const client = await createClient({ url: connectionString })
      .on("error", (err) => console.error(err))
      .connect();
    return new Bus(client);
  }

  public async notify(message: Message): Promise<void> {
    console.log(`BS: notify ${JSON.stringify(message)}`);
    await this.client.publish("message-bus", JSON.stringify(message));
  }

  public async onMessage(callback: (message: Message) => void): Promise<void> {
    const subscriber = await this.client
      .duplicate()
      .on("error", (err) => console.error(err))
      .connect();
    await subscriber.subscribe("message-bus", (data) => {
      console.log(`BS: received ${data}`);
      const message = JSON.parse(data);
      callback(message);
    });
  }
}
