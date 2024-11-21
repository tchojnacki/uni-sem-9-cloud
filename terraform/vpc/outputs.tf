output "public_subnet_id" {
  value = aws_subnet.vpc_public_subnet.id
}

output "security_group_id" {
  value = aws_security_group.vpc_security_group.id
}
