FROM denoland/deno:2.0.3 AS build

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
ENTRYPOINT ["./server"]
