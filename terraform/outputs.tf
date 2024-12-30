output "COGNITO_POOL_ID" {
  value = module.cognito.user_pool_id
}

output "COGNITO_CLIENT_ID" {
  value = module.cognito.user_pool_client_id
}

# output "BACKEND_IP" {
#   value = module.ec2_back.public_ip
# }

# output "FRONTEND_IP" {
#   value = module.ec2_front.public_ip
# }

output "DATABASE_URL" {
  value     = module.rds.url
  sensitive = true
}
