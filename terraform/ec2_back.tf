resource "aws_instance" "ec2_back_instance" {
  ami                    = local.instance_ami
  instance_type          = local.instance_type
  vpc_security_group_ids = [aws_security_group.vpc_security_group.id]
  key_name               = "vockey"

  user_data_replace_on_change = true
  user_data                   = <<-USERDATAEOF
  ${local.ec2_common_setup}

  export DATABASE_URL="postgresql://${aws_db_instance.rds_instance.endpoint}/${local.database.db_name}?user=${local.database.username}&password=${var.database_password}"
  export COGNITO_POOL_ID="${aws_cognito_user_pool.cognito_user_pool.id}"
  export COGNITO_CLIENT_ID="${aws_cognito_user_pool_client.cognito_user_pool_client.id}"
  echo "DATABASE_URL=$DATABASE_URL COGNITO_POOL_ID=$COGNITO_POOL_ID COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID"

  cd backend
  docker build -f ./Dockerfile.prod -t cloudp1-backend-prod .
  docker run -d -e DATABASE_URL -e COGNITO_POOL_ID -e COGNITO_CLIENT_ID -p 80:8001 cloudp1-backend-prod
  USERDATAEOF

  tags = {
    Name = "CloudP1 EC2 Backend"
  }
}
