FROM denoland/deno:2.0.3 AS build

WORKDIR /app

COPY package.json deno.lock ./
RUN deno install

COPY . .
RUN deno task build


FROM ubuntu:24.10 AS run

RUN apt-get update
RUN apt-get install -y busybox-static

EXPOSE 8002
WORKDIR /app
USER ubuntu

COPY ./prod.sh .
COPY --from=build ./app/dist ./dist
ENTRYPOINT ["./prod.sh"]
