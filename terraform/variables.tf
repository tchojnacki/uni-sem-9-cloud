variable "database_password" {
  type        = string
  sensitive   = true
  description = "The password for the RDS Postgres database's default user."
  default     = "password"
}
