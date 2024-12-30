module "vpc" {
  source = "./vpc"

  open_ports = {
    ssh      = 22
    http     = 80
    backend  = 8001
    frontend = 8002
  }
}

module "cognito" {
  source = "./cognito"
}

module "rds" {
  source = "./rds"

  password = var.database_password
}

# locals {
#   ec2_common_setup = <<-SETUPEOF
#   #!/bin/env bash
#   set -x

#   # Update and install packages
#   apt-get update -y
#   apt-get install -y ca-certificates curl

#   # Add Docker's key and repository
#   install -m 0755 -d /etc/apt/keyrings
#   curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
#   chmod a+r /etc/apt/keyrings/docker.asc
#   echo \
#     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
#     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
#     tee /etc/apt/sources.list.d/docker.list > /dev/null
#   apt-get update -y

#   # Install Docker
#   apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
#   SETUPEOF
# }

# module "ec2_back" {
#   source = "./ec2"

#   name              = "backend"
#   security_group_id = aws_security_group.vpc_sg.id
#   user_data         = <<-USERDATAEOF
#   ${local.ec2_common_setup}

#   export DATABASE_URL="${module.rds.url}"
#   export COGNITO_POOL_ID="${aws_cognito_user_pool.cognito_user_pool.id}"
#   export COGNITO_CLIENT_ID="${aws_cognito_user_pool_client.cognito_user_pool_client.id}"
#   echo "DATABASE_URL=$DATABASE_URL COGNITO_POOL_ID=$COGNITO_POOL_ID COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID"

#   cd backend
#   docker run -d -e DATABASE_URL -e COGNITO_POOL_ID -e COGNITO_CLIENT_ID -p 80:8001 tchojnacki2001/cloudp2-backend-prod
#   USERDATAEOF
# }

# module "ec2_front" {
#   source = "./ec2"

#   name              = "frontend"
#   security_group_id = aws_security_group.vpc_sg.id
#   user_data         = <<-USERDATAEOF
#   ${local.ec2_common_setup}

#   export VITE_BACKEND_IP="${module.ec2_back.public_ip}"
#   export VITE_COGNITO_CLIENT_ID="${aws_cognito_user_pool_client.cognito_user_pool_client.id}"
#   echo "VITE_BACKEND_IP=$VITE_BACKEND_IP VITE_COGNITO_CLIENT_ID=$VITE_COGNITO_CLIENT_ID"

#   cd frontend
#   docker run -d -e VITE_BACKEND_IP -e VITE_COGNITO_CLIENT_ID -p 80:8002 tchojnacki2001/cloudp2-frontend-prod
#   USERDATAEOF
# }
