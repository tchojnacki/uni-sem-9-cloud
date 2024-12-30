resource "aws_ecs_cluster" "ecs_cluster" {
  name = "cloud-p2"
}

resource "aws_ecs_task_definition" "ecs_backend_task_definition" {
  family                   = "cloud-p2-backend-family"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  container_definitions = jsonencode([
    {
      name   = "backend"
      image  = "tchojnacki2001/cloudp2-backend-prod:latest"
      cpu    = 256
      memory = 512
      portMappings = [
        {
          containerPort = 8001
        }
      ]
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
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "ecs_backend_service" {
  name            = "cloud-p2-backend-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_backend_task_definition.arn
  launch_type     = "FARGATE"
  desired_count   = 2

  deployment_circuit_breaker {
    enable   = true
    rollback = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_backend_target_group.arn
    container_name   = "backend"
    container_port   = 8001
  }

  network_configuration {
    subnets          = [module.vpc.public_subnet_a_id, module.vpc.public_subnet_b_id]
    security_groups  = [module.vpc.security_group_id]
    assign_public_ip = true
  }
}

resource "aws_lb" "ecs_backend_load_balancer" {
  name               = "cloud-p2-backend-load-balancer"
  load_balancer_type = "application"
  subnets            = [module.vpc.public_subnet_a_id, module.vpc.public_subnet_b_id]
  security_groups    = [module.vpc.security_group_id]
}

resource "aws_lb_target_group" "ecs_backend_target_group" {
  name        = "cloud-p2-backend-target-group"
  target_type = "ip"
  port        = 8001
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
}

resource "aws_lb_listener" "ecs_backend_listener" {
  load_balancer_arn = aws_lb.ecs_backend_load_balancer.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_backend_target_group.arn
  }
}
