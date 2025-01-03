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

module "vpc" {
  source = "./vpc"

  open_ports = {
    ssh      = 22
    http     = 80
    backend  = 8001
    frontend = 8002
    redis    = 6379
  }
}

module "cognito" {
  source = "./cognito"
}

module "rds" {
  source = "./rds"

  password = var.database_password
}
