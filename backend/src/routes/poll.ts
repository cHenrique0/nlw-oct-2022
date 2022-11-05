import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";

export async function pollRoutes(fastify: FastifyInstance) {
  // Route: Count created polls
  fastify.get("/polls/count", async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  // Route: Create a poll
  fastify.post("/polls", async (request, reply) => {
    // Validations
    const createPollBody = z.object({
      title: z.string(),
    });
    const { title } = createPollBody.parse(request.body);

    // Creating the poll code with 6 chars
    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    // Create the poll
    try {
      // Checking if the user is logged in by jwt token
      await request.jwtVerify();

      // If true then create the poll with user id as poll owner
      await prisma.poll.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          // Add the user logged as a poll participant
          participants: {
            create: {
              userId: request.user.sub,
            },
          },
        },
      });
    } catch (error) {
      // If the user is not logged in, don't create a poll with owner
      await prisma.poll.create({
        data: {
          title,
          code,
        },
      });
    }

    return reply.status(201).send({ code });
  });
}
