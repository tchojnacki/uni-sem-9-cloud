resource "aws_vpc" "vpc_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "cloudp1-vpc"
  }
}

resource "aws_subnet" "vpc_public_subnet" {
  for_each = {
    "us-east-1a" = "10.0.0.0/17"
    "us-east-1b" = "10.0.128.0/17"
  }

  vpc_id                  = aws_vpc.vpc_vpc.id
  availability_zone       = each.key
  cidr_block              = each.value
  map_public_ip_on_launch = true
  tags = {
    Name = "cloudp1-public-subnet-${each.key}"
  }
}

resource "aws_internet_gateway" "vpc_gateway" {
  vpc_id = aws_vpc.vpc_vpc.id
  tags = {
    Name = "cloudp1-internet-gateway"
  }
}

resource "aws_route_table" "vpc_route_table" {
  vpc_id = aws_vpc.vpc_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.vpc_gateway.id
  }
  tags = {
    Name = "cloudp1-route-table"
  }
}

resource "aws_route_table_association" "vpc_route_table_association" {
  for_each = aws_subnet.vpc_public_subnet

  subnet_id      = each.value.id
  route_table_id = aws_route_table.vpc_route_table.id
}

resource "aws_security_group" "vpc_security_group" {
  name   = "cloudp1-security-group"
  vpc_id = aws_vpc.vpc_vpc.id
}

resource "aws_vpc_security_group_egress_rule" "vpc_egress_rule" {
  security_group_id = aws_security_group.vpc_security_group.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"
}

resource "aws_vpc_security_group_ingress_rule" "vpc_ingress_rule" {
  for_each = var.open_ports

  security_group_id = aws_security_group.vpc_security_group.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = each.value
  to_port     = each.value
}
