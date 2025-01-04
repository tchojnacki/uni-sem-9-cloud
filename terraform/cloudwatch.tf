resource "aws_cloudwatch_metric_alarm" "cloudwatch_alarm" {
  alarm_name = "cloud-p2-adminmsg-queue-overloaded-alarm"

  namespace           = "AWS/SQS"
  dimensions          = { QueueName = aws_sqs_queue.sqs_queue["adminmsg"].name }
  metric_name         = "NumberOfMessagesSent"
  statistic           = "Sum"
  comparison_operator = "GreaterThanThreshold"
  threshold           = 5

  period              = 60
  datapoints_to_alarm = 1
  evaluation_periods  = 1

  alarm_actions = [aws_sns_topic.cloudwatch_sns_topic.arn]
}

resource "aws_sns_topic" "cloudwatch_sns_topic" {
  name = "cloud-p2-adminmsg-queue-overloaded-topic"
}

# resource "aws_sns_topic_subscription" "cloudwatch_sns_email" {
#   topic_arn = aws_sns_topic.cloudwatch_sns_topic.arn
#   protocol  = "email"
#   endpoint  = "260365@student.pwr.edu.pl"
# }
