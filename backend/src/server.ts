import Fastify from "fastify";
import cors from "@fastify/cors";

import { pollRoutes } from "./routes/poll";
import { userRoutes } from "./routes/user";
import { guessRoutes } from "./routes/guess";
import { matchRoutes } from "./routes/match";
import { authRoutes } from "./routes/auth";

async function start() {
  const fastify = Fastify({ logger: true });

  // cors
  await fastify.register(cors, { origin: true }); // trocar o valor de origin pelo domínio do frontend

  // Adding the routes
  await fastify.register(authRoutes);
  await fastify.register(pollRoutes);
  await fastify.register(userRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(matchRoutes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" }); // configurar host para funcionar no android
}

start();
