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
  github = {
    user = "tchojnacki"
    repo = "cloud-p1"
  }
  ec2_common_setup = <<-SETUPEOF
  # Update and install packages
  apt-get update -y
  apt-get install -y ca-certificates curl

  # Add Docker's key and repository
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -y

  # Install Docker
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # Clone the repository
  cd ~
  git clone https://${var.github_token}@github.com/${local.github.user}/${local.github.repo}.git
  cd cloud-p1
  SETUPEOF
}
