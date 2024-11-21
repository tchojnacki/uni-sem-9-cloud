resource "aws_instance" "ec2_instance" {
  ami           = "ami-0866a3c8686eaeeba" # Ubuntu Server 24.04 LTS 64-bit (x86)
  instance_type = "t2.micro"

  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = "vockey"

  user_data_replace_on_change = true
  user_data                   = var.user_data

  tags = {
    Name = "cloudp1-ec2-${var.name}"
  }
}
