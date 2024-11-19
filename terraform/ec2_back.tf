resource "aws_instance" "ec2_back_instance" {
  ami                    = local.instance_ami
  instance_type          = local.instance_type
  vpc_security_group_ids = [aws_security_group.vpc_security_group.id]
  key_name               = "vockey"

  user_data_replace_on_change = true
  user_data                   = <<-USERDATAEOF
  #!/bin/env bash

  ${locals.ec2_common_setup}
  USERDATAEOF

  tags = {
    Name = "CloudP1 EC2 Backend"
  }
}
