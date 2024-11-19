resource "aws_instance" "ec2_front_instance" {
  ami                    = local.instance_ami
  instance_type          = local.instance_type
  vpc_security_group_ids = [aws_security_group.vpc_security_group.id]
  key_name               = "vockey"

  user_data_replace_on_change = true
  user_data                   = <<-USERDATAEOF
  #!/bin/env bash

  ${local.ec2_common_setup}

  export BACKEND_IP="${aws_instance.ec2_back_instance.public_ip}"
  export COGNITO_CLIENT_ID="${aws_cognito_user_pool_client.cognito_user_pool_client.id}"
  echo "$BACKEND_IP $COGNITO_CLIENT_ID"

  USERDATAEOF

  tags = {
    Name = "CloudP1 EC2 Frontend"
  }
}
