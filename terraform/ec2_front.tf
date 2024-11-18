resource "aws_instance" "ec2_front_instance" {
  ami                    = local.instance_ami
  instance_type          = local.instance_type
  vpc_security_group_ids = [aws_security_group.vpc_security_group.id]
  key_name               = "vockey"
  tags = {
    Name = "CloudP1 EC2 Frontend"
  }
}
