resource "aws_vpc" "vpc_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "CloudP1 VPC"
  }
}

resource "aws_subnet" "vpc_public_subnet" {
  vpc_id                  = aws_vpc.vpc_vpc.id
  cidr_block              = "10.0.0.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name = "CloudP1 Public Subnet"
  }
}

resource "aws_internet_gateway" "vpc_gateway" {
  vpc_id = aws_vpc.vpc_vpc.id
  tags = {
    Name = "CloudP1 Internet Gateway"
  }
}

resource "aws_route_table" "vpc_route_table" {
  vpc_id = aws_vpc.vpc_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.vpc_gateway.id
  }
  tags = {
    Name = "CloudP1 Route Table"
  }
}

resource "aws_route_table_association" "vpc_route_table_association" {
  subnet_id      = aws_subnet.vpc_public_subnet.id
  route_table_id = aws_route_table.vpc_route_table.id
}

resource "aws_security_group" "vpc_security_group" {
  name        = "CloudP1 Security Group"
  description = "Allow selected inbound and all outbound traffic."
  vpc_id      = aws_vpc.vpc_vpc.id
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
