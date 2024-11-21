output "url" {
  value     = "postgresql://${aws_db_instance.rds_instance.endpoint}/cloudp1?user=postgres&password=${var.password}"
  sensitive = true
}
