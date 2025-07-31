# Cloud Project ☁️ (Application of Cloud Solutions in Web Applications)

<div align="center">

![AWS](https://custom-icon-badges.demolab.com/badge/AWS-%23FF9900.svg?logo=aws&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-844FBA?logo=terraform&logoColor=fff)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)

![Deno](https://img.shields.io/badge/Deno-000?logo=deno&logoColor=fff)
![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![CSS](https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff)

</div>

<p align="justify">
<strong>Cloud Project</strong> is a cloud-based demo web chat application built as part of the Application of Cloud Solutions in Web Applications course at the Wrocław University of Science and Technology. It showcases the integration of various AWS products to create a functional and scalable web application. Used AWS services include: EC2, ECS, VPC, RDS, SQS, SNS, Cognito, Lambda, Elasticache, and CloudWatch. The application allows for sign-up, sign-in, and real-time messaging between users (using WebSockets).
</p>

![](./docs/img/screenshot.png)

## AWS Services 📦

- **EC2**/**ECS**: hosting the application,
- **VPC**: network isolation and security groups,
- **RDS**: database for storing messages,
- **SQS**: communication between services and Lambda,
- **SNS**: notifications coming from CloudWatch,
- **Cognito**: user authentication,
- **Lambda**: asynchronous message processing,
- **Elasticache**: hosting Redis for pub/sub notifications,
- **CloudWatch**: alerts on queue overload.
