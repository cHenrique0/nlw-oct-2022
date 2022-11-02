import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";

const prisma = new PrismaClient({ log: ["query"] });

async function start() {
  const fastify = Fastify({ logger: true });
  await fastify.register(cors, { origin: true }); // trocar o valor de origin pelo domínio do frontend

  // Route: count created users
  fastify.get("/users/count", async () => {
    const count = await prisma.user.count();

    return { count };
  });

  // Route: count created guesses
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  // Route: count created pools
  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();

    return { count };
  });

  // Route: create a pool
  fastify.post("/pools", async (request, reply) => {
    // Validations
    const createPoolBody = z.object({
      title: z.string(),
    });
    const { title } = createPoolBody.parse(request.body);

    // Creating the code with 6 chars
    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    // Creating the pool
    await prisma.pool.create({
      data: {
        title,
        code,
      },
    });

    return reply.status(201).send({ code });
  });

  await fastify.listen({ port: 3333, host: "0.0.0.0" }); // configurar host para funcionar no android
}

start();
