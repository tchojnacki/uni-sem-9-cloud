resource "aws_sqs_queue" "sqs_queue" {
  for_each = toset(["analysis", "adminmsg"])

  name                       = each.value
  visibility_timeout_seconds = 30
  message_retention_seconds  = 3600
  receive_wait_time_seconds  = 20
}

data "aws_iam_role" "lambda_role" {
  name = "LabRole"
}

data "archive_file" "lambda_archive" {
  type        = "zip"
  source_file = "../lambda/index.mjs"
  output_path = "lambda-payload.zip"
}

resource "aws_lambda_function" "lambda_function" {
  function_name                  = "cloud-p2-analysis-lambda"
  role                           = data.aws_iam_role.lambda_role.arn
  runtime                        = "nodejs22.x"
  filename                       = data.archive_file.lambda_archive.output_path
  source_code_hash               = data.archive_file.lambda_archive.output_base64sha256
  handler                        = "index.main"
  timeout                        = 25
  reserved_concurrent_executions = 2

  environment {
    variables = {
      ADMINMSG_QUEUE_URL = aws_sqs_queue.sqs_queue["adminmsg"].url
    }
  }
}

resource "aws_lambda_event_source_mapping" "lambda_trigger" {
  event_source_arn = aws_sqs_queue.sqs_queue["analysis"].arn
  function_name    = aws_lambda_function.lambda_function.arn
  batch_size       = 1
}
