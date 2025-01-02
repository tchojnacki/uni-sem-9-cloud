resource "aws_db_instance" "rds_instance" {
  identifier             = "cloudp1-rds"
  engine                 = "postgres"
  engine_version         = "14.14"
  instance_class         = "db.t4g.micro"
  allocated_storage      = 5 # GB
  db_name                = "cloudp1"
  username               = "postgres"
  password               = var.password
  skip_final_snapshot    = true
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
}

resource "aws_security_group" "rds_security_group" {
  name = "cloudp1-rds-security-group"

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
