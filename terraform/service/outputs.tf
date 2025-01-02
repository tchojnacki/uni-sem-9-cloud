output "public_ip" {
  value = aws_lb.service_load_balancer.dns_name
}
