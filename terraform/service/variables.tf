variable "name" {
  type = string
}

variable "image" {
  type = string
}

variable "port" {
  type    = number
  default = 80
}

variable "environment" {
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

variable "desired_count" {
  type    = number
  default = 2
}

variable "health_check" {
  type    = string
  default = "/"
}

variable "cluster_id" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}
