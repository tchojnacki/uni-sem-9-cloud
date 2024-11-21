#set par(justify: true)
#align(center)[
= Zastosowanie rozwiązań chmurowych w aplikacjach webowych
= Instrukcja -- Projekt 1
#v(2em)
#set text(weight: "bold")
Tomasz Chojnacki \ #link("mailto:260365@student.pwr.edu.pl", text(fill: blue, "260365@student.pwr.edu.pl"))
#v(2em)
]

== 1. Opis architektury

=== Węzły

- `rds` -- baza danych Postgres 14.14 na AWS RDS (`db.t3.micro`, 5GB pamięci)
- `cognito` -- user pool i client na AWS Cognito, flow `USER_PASSWORD_AUTH` i `CONFIRM_WITH_LINK`
- `ec2-back` -- serwer Deno (TypeScript) na AWS EC2 (Ubuntu Server 24.04, `t2.micro`)
- `ec2-front` -- BusyBox HTTPD z Reactem na AWS EC2 (Ubuntu Server 24.04, `t2.micro`)

=== Połączenia

- `ec2-back` #sym.arrow.r `rds:5432` (biblioteka `@bartlomieju/postgres`; TCP)
- `ec2-back` #sym.arrow.r `cognito` (biblioteka `aws-jwt-verify`; HTTP)
- `ec2-front` #sym.arrow.r `ec2-back:80` (HTTP, WebSocket)
- `ec2-front` #sym.arrow.r `cognito` (biblioteka `@aws-sdk/client-cognito-identity-provider`; HTTP)

== 2. Docker

=== Frontend

```Dockerfile
FROM denoland/deno:2.0.6 AS build

ARG BACKEND_IP
ARG COGNITO_CLIENT_ID

WORKDIR /app

COPY package.json deno.lock ./
RUN deno install

COPY . .
ENV VITE_BACKEND_IP=$BACKEND_IP
ENV VITE_COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID
RUN deno task build


FROM ubuntu:24.10 AS run

RUN apt-get update
RUN apt-get install -y busybox-static

EXPOSE 8002
WORKDIR /app
USER ubuntu

COPY ./serve.sh .
COPY --from=build ./app/dist ./dist
ENTRYPOINT ["./serve.sh"]
```

```bash
docker build -f ./Dockerfile.prod \
  --build-arg BACKEND_IP --build-arg COGNITO_CLIENT_ID \
  -t cloudp1-frontend-prod .
docker run -d -p 80:8002 cloudp1-frontend-prod
```

=== Backend

```Dockerfile
FROM denoland/deno:2.0.6 AS build

WORKDIR /app

COPY deno.json deno.lock ./
RUN deno install

COPY . .
RUN deno task compile


FROM ubuntu:24.10 AS run

EXPOSE 8001
WORKDIR /app
USER ubuntu

COPY --from=build ./app/server ./server
CMD ["./server"]
```

```bash
docker build -f ./Dockerfile.prod -t cloudp1-backend-prod .
docker run -d -e DATABASE_URL -e COGNITO_POOL_ID \
  -e COGNITO_CLIENT_ID -p 80:8001 cloudp1-backend-prod
```

=== Compose

Docker Compose jest wykorzystywany jedynie do lokalnego uruchomienia systemu na cele rozwoju aplikacji. Wymaga utworzenia user pool i clienta w AWS Cognito, co jest zautomatyzowane za pomocą Terraform w `cognito/cognito-dev.tf`. Podajemy do Compose zmienne środowiskowe `COGNITO_POOL_ID` i `COGNITO_CLIENT_ID` zwrócone przez `terraform output`. Baza danych w RDS jest zastąpiona przez lokalny kontener Postgres. Wszystkie zmienne środowiskowe niezbędne do uruchomienia systemu są przekazywane automatycznie. Zdefiniowane są healthchecki dla serwisów `backend` i `database` oraz zależności: `frontend` od `backend` i `backend` od `database`.

```yaml
services:
  backend:
    build:
      context: "./backend"
      dockerfile: "Dockerfile.dev"
    ports:
      - "8001:8001"
    environment:
      DATABASE_URL: "postgresql://postgres:pass@database:5432/postgres"
      COGNITO_POOL_ID: "$COGNITO_POOL_ID"
      COGNITO_CLIENT_ID: "$COGNITO_CLIENT_ID"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://backend:8001/api/v1/health"]
      interval: 1m
      timeout: 5s
      start_period: 10s
      start_interval: 1s
    depends_on:
      database:
        condition: "service_healthy"
  frontend:
    build:
      context: "./frontend"
      dockerfile: "Dockerfile.dev"
    ports:
      - "8002:8002"
    environment:
      VITE_BACKEND_IP: "http://localhost:8001"
      VITE_COGNITO_CLIENT_ID: "$COGNITO_CLIENT_ID"
    depends_on:
      backend:
        condition: "service_healthy"
  database:
    image: "postgres:17.0-alpine"
    environment:
      POSTGRES_PASSWORD: "pass"
    volumes:
      - ".postgres:/var/lib/postgresql/data"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
      interval: 1m
      timeout: 5s
      start_period: 10s
      start_interval: 1s
```

== 3. Terraform

Główna konfiguracja Terraform składa się z plików `variables.tf` (czytającego zmienne `database_password` i `github_token` niezbędne do wdrożenia systemu), `outputs.tf` (zwracającego `COGNITO_POOL_ID`, `COGNITO_CLIENT_ID`, `BACKEND_IP`, `FRONTEND_IP` oraz `DATABASE_URL`), `provider.tf` (konfigurującego połączenie z AWS) oraz `main.tf` (uruchamiającego moduły). Oprócz tego powstały cztery podmoduły Terraform opisane poniżej.

Każda z instancji EC2 dostaje user data, które kolejno: aktualizuje pakiety, instaluje Docker, klonuje repozytorium z kodem aplikacji, buduje i uruchamia odpowiedni kontener.

=== VPC

- Wejście: `open_ports`
- Wyjście: `public_subnet_id`, `security_group_id`
- Zasoby:
  - `aws_vpc`,
  - `aws_subnet`,
  - `aws_internet_gateway`,
  - `aws_route_table`,
  - `aws_route_table_association`,
  - `aws_security_group`,
  - `aws_security_group_egress_rule`,
  - `aws_security_group_ingress_rule`

#pagebreak()

=== RDS

- Wejście: `password`
- Wyjście: `url`
- Zasoby:
  - `aws_db_instance`,
  - `aws_security_group`

=== Cognito

- Wejście: brak
- Wyjście: `user_pool_id`, `user_pool_client_id`
- Zasoby:
  - `aws_cognito_user_pool`,
  - `aws_cognito_user_pool_client`,
  - `aws_cognito_user_pool_domain`

=== EC2

- Wejście: `name`, `subnet_id`, `security_group_id`, `user_data`
- Wyjście: `public_ip`
- Zasoby:
  - `aws_instance`

== 4. Interfejs webowy AWS

=== VPC

#v(1fr)
#image("./img/vpc-1.png")
#v(1fr)
#image("./img/vpc-2.png")
#v(1fr)
#image("./img/vpc-3.png")
#v(1fr)

=== RDS

#v(1fr)
#image("./img/rds-1.png")
#v(1fr)
#image("./img/rds-2.png")
#v(1fr)
#image("./img/rds-3.png")
#v(1fr)

=== Cognito

#v(1fr)
#image("./img/cognito-1.png")
#v(1fr)
#image("./img/cognito-2.png")
#v(1fr)
#image("./img/cognito-3.png")
#v(1fr)
#image("./img/cognito-4.png")
#v(1fr)
#image("./img/cognito-5.png")
#v(1fr)
#image("./img/cognito-6.png")
#v(1fr)

=== EC2

#v(1fr)
#image("./img/ec2-1.png")
#v(1fr)
#image("./img/ec2-2.png")
#v(1fr)
