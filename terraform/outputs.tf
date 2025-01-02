output "BACKEND_IP" {
  value = module.ecs_backend.public_ip
}

output "FRONTEND_IP" {
  value = module.ecs_frontend.public_ip
}

output "DATABASE_URL" {
  value     = module.rds.url
  sensitive = true
}

output "BUS_URL" {
  value     = "redis://${aws_elasticache_cluster.redis_instance.cache_nodes.0.address}:6379"
  sensitive = true
}
