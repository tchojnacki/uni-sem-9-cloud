resource "aws_ecs_cluster" "ecs_cluster" {
  name = "cloud-p2"
}

module "ecs_backend" {
  source = "./service"

  name  = "backend"
  image = "tchojnacki2001/cloudp2-backend-prod:latest"
  port  = 8001
  environment = [
    {
      name  = "DATABASE_URL"
      value = module.rds.url
    },
    {
      name  = "COGNITO_POOL_ID"
      value = module.cognito.user_pool_id
    },
    {
      name  = "COGNITO_CLIENT_ID"
      value = module.cognito.user_pool_client_id
    },
    {
      name  = "BUS_URL"
      value = "redis://${aws_elasticache_cluster.redis_instance.cache_nodes.0.address}:6379"
    },
    {
      name  = "ANALYSIS_QUEUE_URL"
      value = aws_sqs_queue.sqs_queue["analysis"].id
    },
    {
      name  = "ADMINMSG_QUEUE_URL"
      value = aws_sqs_queue.sqs_queue["adminmsg"].id
    }
  ]
  desired_count     = 2
  health_check      = "/api/v1/health"
  cluster_id        = aws_ecs_cluster.ecs_cluster.id
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.public_subnet_ids
  security_group_id = module.vpc.security_group_id
}

module "ecs_frontend" {
  source = "./service"

  name  = "frontend"
  image = "tchojnacki2001/cloudp2-frontend-prod:latest"
  port  = 8002
  environment = [
    {
      name  = "VITE_BACKEND_IP"
      value = module.ecs_backend.public_ip
    },
    {
      name  = "VITE_COGNITO_CLIENT_ID"
      value = module.cognito.user_pool_client_id
    }
  ]
  desired_count     = 2
  health_check      = "/"
  cluster_id        = aws_ecs_cluster.ecs_cluster.id
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.public_subnet_ids
  security_group_id = module.vpc.security_group_id
}
