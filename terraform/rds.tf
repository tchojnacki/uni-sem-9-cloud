resource "aws_db_instance" "rds_instance" {
  identifier             = "cloudp1-rds"
  engine                 = local.database.engine
  engine_version         = local.database.version
  instance_class         = local.database.class
  allocated_storage      = local.database.storage
  db_name                = local.database.db_name
  username               = local.database.username
  password               = var.database_password
  skip_final_snapshot    = true
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.vpc_security_group.id]
}
