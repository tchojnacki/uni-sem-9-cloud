output "BACKEND_IP" {
  value = "http://${module.ecs_backend.public_ip}"
}

output "FRONTEND_IP" {
  value = "http://${module.ecs_frontend.public_ip}"
}
