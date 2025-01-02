resource "aws_ecs_task_definition" "service_task_definition" {
  family                   = "cloud-p2-${var.name}-family"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  container_definitions = jsonencode([
    {
      name         = var.name
      image        = var.image
      cpu          = 256
      memory       = 512
      portMappings = [{ containerPort = var.port }]
      environment  = var.environment
    }
  ])
}

resource "aws_ecs_service" "service_service" {
  name            = "cloud-p2-${var.name}-service"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.service_task_definition.arn
  launch_type     = "FARGATE"
  desired_count   = var.desired_count

  deployment_circuit_breaker {
    enable   = true
    rollback = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.service_target_group.arn
    container_name   = var.name
    container_port   = var.port
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = true
  }
}

resource "aws_lb" "service_load_balancer" {
  name               = "cloud-p2-${var.name}-load-balancer"
  load_balancer_type = "application"
  subnets            = var.subnet_ids
  security_groups    = [var.security_group_id]
}

resource "aws_lb_target_group" "service_target_group" {
  name        = "cloud-p2-${var.name}-target-group"
  target_type = "ip"
  port        = var.port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id

  health_check {
    path = var.health_check
  }
}

resource "aws_lb_listener" "service_listener" {
  load_balancer_arn = aws_lb.service_load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service_target_group.arn
  }
}
