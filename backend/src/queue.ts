import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

export class Queue {
  private readonly client: SQSClient;

  public constructor(private readonly queueUrl: string | null = null) {
    this.client = new SQSClient({ region: "us-east-1" });
  }

  public async send(data: unknown): Promise<void> {
    const body = JSON.stringify(data);
    console.log(`QE: send ${body}`);
    if (this.queueUrl) {
      await this.client.send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageBody: body,
        })
      );
    }
  }

  public receive(callback: (data: unknown) => Promise<void> | void): void {
    const QueueUrl = this.queueUrl;
    if (!QueueUrl) {
      return;
    }
    void (async () => {
      const { Messages = [] } = await this.client.send(
        new ReceiveMessageCommand({
          QueueUrl,
          MaxNumberOfMessages: 1,
        })
      );

      for (const { Body, ReceiptHandle } of Messages) {
        if (Body && ReceiptHandle) {
          const data = JSON.parse(Body);
          console.log(`QE: receive ${Body}`);
          try {
            await callback(data);
          } catch (error) {
            console.log(`QE: error ${error}`);
          }
          await this.client.send(
            new DeleteMessageCommand({ QueueUrl, ReceiptHandle })
          );
        }
      }

      this.receive(callback);
    })();
  }
}
