resource "aws_security_group" "vpc_security_group" {
  name        = "CloudP1 Security Group"
  description = "Allow selected inbound and all outbound traffic."
}

resource "aws_vpc_security_group_egress_rule" "vpc_egress_rule" {
  security_group_id = aws_security_group.vpc_security_group.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"
}

resource "aws_vpc_security_group_ingress_rule" "vpc_ingress_rule" {
  for_each = local.open_ports

  security_group_id = aws_security_group.vpc_security_group.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = each.value
  to_port     = each.value
}
