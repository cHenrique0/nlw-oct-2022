import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import cors from "@fastify/cors";

const prisma = new PrismaClient({ log: ["query"] });

async function start() {
  const fastify = Fastify({ logger: true });
  await fastify.register(cors, { origin: true }); // trocar o valor de origin pelo domínio do frontend

  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();

    return { count };
  });

  await fastify.listen({ port: 3333, host: "0.0.0.0" }); // configurar host para funcionar no android
}

start();
