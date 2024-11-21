variable "database_password" {
  type        = string
  sensitive   = true
  description = "The password for the RDS Postgres database's default user."
}

variable "github_token" {
  type        = string
  sensitive   = true
  description = "A fine-grained GitHub access token to clone the private repository."
}
