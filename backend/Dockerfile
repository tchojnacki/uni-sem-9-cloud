FROM denoland/deno:2.0.6

RUN apt-get update
RUN apt-get install -y curl

EXPOSE 8001
WORKDIR /app
RUN chown -R deno:deno /app
USER deno

COPY deno.json deno.lock ./
RUN deno install

COPY . .
CMD ["deno", "task", "start"]
