import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function main({ Records }) {
  console.assert(Records.length <= 1, "Expected at most one record");

  const client = new SQSClient({ region: "us-east-1" });
  const adminmsgQueueUrl = process.env.ADMINMSG_QUEUE_URL;
  console.log(`ADMINMSG_QUEUE_URL="${adminmsgQueueUrl}"`);

  for (const { body } of Records) {
    const data = JSON.parse(body);
    console.log("Processing record...", data);

    await sleep(5000);

    if (/[0-9]/.test(data.content)) {
      console.log("Record contains a number, enqueueing a message for admin!");

      await client.send(
        new SendMessageCommand({
          QueueUrl: adminmsgQueueUrl,
          MessageBody: JSON.stringify(data),
        })
      );
    } else {
      console.log("Record does not contain a number!");
    }

    console.log("Record processed", data);
  }
}
