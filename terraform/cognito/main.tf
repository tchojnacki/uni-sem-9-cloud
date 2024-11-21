resource "aws_cognito_user_pool" "cognito_user_pool" {
  name                     = "cloudp1-user-pool"
  auto_verified_attributes = ["email"]
  password_policy {
    minimum_length    = 6
    require_lowercase = false
    require_uppercase = false
    require_numbers   = false
    require_symbols   = false
  }
  verification_message_template {
    default_email_option = "CONFIRM_WITH_LINK"
  }
}

resource "aws_cognito_user_pool_client" "cognito_user_pool_client" {
  name                = "cloudp1-user-pool-client"
  user_pool_id        = aws_cognito_user_pool.cognito_user_pool.id
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

resource "aws_cognito_user_pool_domain" "cognito_user_pool_domain" {
  domain       = "tchojnacki-dev-cloud-p1-prod"
  user_pool_id = aws_cognito_user_pool.cognito_user_pool.id
}
