locals {
  aws_region    = "us-east-1"             # N. Virginia
  instance_ami  = "ami-0866a3c8686eaeeba" # Ubuntu Server 24.04 LTS 64-bit (x86)
  instance_type = "t2.micro"
  open_ports = {
    ssh        = 22
    http       = 80
    postgresql = 5432
  }
  database = {
    engine  = "postgres"
    version = "16.3"
    class   = "db.t3.micro"
    storage = 5 # GB

    db_name  = "cloudp1"
    username = "postgres"
  }
}
