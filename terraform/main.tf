module "vpc" {
  source = "./vpc"

  open_ports = {
    ssh  = 22
    http = 80
  }
}

module "cognito" {
  source = "./cognito"
}

module "rds" {
  source = "./rds"

  password = var.database_password
}

locals {
  ec2_common_setup = <<-SETUPEOF
  #!/bin/env bash
  set -x

  # Update and install packages
  apt-get update -y
  apt-get install -y ca-certificates curl

  # Add Docker's key and repository
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -y

  # Install Docker
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # Clone the repository
  cd ~
  git clone https://${var.github_token}@github.com/tchojnacki/cloud-p1.git
  cd cloud-p1
  SETUPEOF
}

module "ec2_back" {
  source = "./ec2"

  name              = "backend"
  subnet_id         = module.vpc.public_subnet_id
  security_group_id = module.vpc.security_group_id
  user_data         = <<-USERDATAEOF
  ${local.ec2_common_setup}

  export DATABASE_URL="${module.rds.url}"
  export COGNITO_POOL_ID="${module.cognito.user_pool_id}"
  export COGNITO_CLIENT_ID="${module.cognito.user_pool_client_id}"
  echo "DATABASE_URL=$DATABASE_URL COGNITO_POOL_ID=$COGNITO_POOL_ID COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID"

  cd backend
  docker build -f ./Dockerfile.prod -t cloudp1-backend-prod .
  docker run -d -e DATABASE_URL -e COGNITO_POOL_ID -e COGNITO_CLIENT_ID -p 80:8001 cloudp1-backend-prod
  USERDATAEOF
}

module "ec2_front" {
  source = "./ec2"

  name              = "frontend"
  subnet_id         = module.vpc.public_subnet_id
  security_group_id = module.vpc.security_group_id
  user_data         = <<-USERDATAEOF
  ${local.ec2_common_setup}

  export VITE_BACKEND_IP="${module.ec2_back.public_ip}"
  export VITE_COGNITO_CLIENT_ID="${module.cognito.user_pool_client_id}"
  echo "VITE_BACKEND_IP=$VITE_BACKEND_IP VITE_COGNITO_CLIENT_ID=$VITE_COGNITO_CLIENT_ID"

  cd frontend
  docker build -f ./Dockerfile -t cloudp1-frontend-prod .
  docker run -d -e VITE_BACKEND_IP -e VITE_COGNITO_CLIENT_ID -p 80:8002 cloudp1-frontend-prod
  USERDATAEOF
}
