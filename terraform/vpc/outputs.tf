output "vpc_id" {
  value = aws_vpc.vpc_vpc.id
}

output "public_subnet_a_id" {
  value = aws_subnet.vpc_public_subnet_a.id
}

output "public_subnet_b_id" {
  value = aws_subnet.vpc_public_subnet_b.id
}

output "security_group_id" {
  value = aws_security_group.vpc_security_group.id
}
