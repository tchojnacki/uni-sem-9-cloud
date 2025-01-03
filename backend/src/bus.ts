import { createClient } from "redis";
import { Message } from "./types.ts";

type Client = ReturnType<typeof createClient>;

const wrap = (instance: Client): Promise<Client> =>
  instance.on("error", (err) => console.error("BS: ", err)).connect();

export class Bus {
  private constructor(private readonly client: Client) {}

  public static async setup(connectionString: string): Promise<Bus> {
    const client = await wrap(createClient({ url: connectionString }));
    return new Bus(client);
  }

  public async pubMessage(message: Message): Promise<void> {
    const data = JSON.stringify(message);
    console.log(`BS: pub ${data}`);
    await this.client.publish("message-bus", data);
  }

  public async subMessage(
    callback: (message: Message) => Promise<void> | void
  ): Promise<void> {
    const subscriber = await wrap(this.client.duplicate());
    await subscriber.subscribe("message-bus", async (data) => {
      const message = JSON.parse(data);
      console.log(`BS: sub ${data}`);
      try {
        await callback(message);
      } catch (error) {
        console.log(`BS: error ${error}`);
      }
    });
  }
}
