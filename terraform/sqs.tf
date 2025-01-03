resource "aws_sqs_queue" "sqs_queue" {
  for_each = toset(["analysis", "adminmsg"])

  name                      = each.value
  message_retention_seconds = 3600
  receive_wait_time_seconds = 20
}
