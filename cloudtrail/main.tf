terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" # N. Virginia
}

resource "aws_cloudtrail" "cloudtrail_trail" {
  depends_on = [aws_s3_bucket_policy.cloudtrail_bucket_policy]

  name           = "cloud-p2-cloudtrail-trail"
  s3_bucket_name = aws_s3_bucket.cloudtrail_bucket.id
}

resource "aws_s3_bucket" "cloudtrail_bucket" {
  bucket        = "cloud-p2-cloudtrail-bucket"
  force_destroy = true
}

data "aws_iam_policy_document" "cloudtrail_policy" {
  # https://docs.aws.amazon.com/awscloudtrail/latest/userguide/create-s3-bucket-policy-for-cloudtrail.html
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudtrail.amazonaws.com"]
    }
    actions   = ["s3:GetBucketAcl", "s3:PutObject"]
    resources = [aws_s3_bucket.cloudtrail_bucket.arn, "${aws_s3_bucket.cloudtrail_bucket.arn}/*"]
  }
}

resource "aws_s3_bucket_policy" "cloudtrail_bucket_policy" {
  bucket = aws_s3_bucket.cloudtrail_bucket.bucket
  policy = data.aws_iam_policy_document.cloudtrail_policy.json
}
