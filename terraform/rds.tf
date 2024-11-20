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
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
}

resource "aws_security_group" "rds_security_group" {
  name = "Cloud1 RDS Security Group"

  ingress {
    protocol    = "tcp"
    from_port   = 5432
    to_port     = 5432
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = -1
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}
