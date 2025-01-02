output "vpc_id" {
  value = aws_vpc.vpc_vpc.id
}

output "public_subnet_ids" {
  value = [for subnet in aws_subnet.vpc_public_subnet : subnet.id]
}

output "security_group_id" {
  value = aws_security_group.vpc_security_group.id
}
