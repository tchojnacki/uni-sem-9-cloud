FROM denoland/deno:2.0.6

EXPOSE 8002
WORKDIR /app
RUN chown -R deno:deno /app
USER deno

COPY package.json deno.lock ./
RUN deno install

COPY . .
CMD ["deno", "task", "start"]
