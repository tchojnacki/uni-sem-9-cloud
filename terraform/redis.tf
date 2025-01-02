resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "cloud-p2-redis-subnet-group"
  subnet_ids = [module.vpc.public_subnet_a_id, module.vpc.public_subnet_b_id]
}

resource "aws_elasticache_cluster" "redis_instance" {
  cluster_id           = "cloud-p2-redis-instance"
  engine               = "redis"
  node_type            = "cache.t4g.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.1"
  apply_immediately    = true
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids   = [module.vpc.security_group_id]
}
