output "COGNITO_POOL_ID" {
  value = aws_cognito_user_pool.cognito_user_pool.id
}

output "COGNITO_CLIENT_ID" {
  value = aws_cognito_user_pool_client.cognito_user_pool_client.id
}

output "BACKEND_IP" {
  value = aws_instance.ec2_back_instance.public_ip
}

output "FRONTEND_IP" {
  value = aws_instance.ec2_front_instance.public_ip
}

output "DATABASE_URL" {
  value = "postgresql://${aws_db_instance.rds_instance.endpoint}/${local.database.db_name}?user=${local.database.username}?password=${var.database_password}"
}
