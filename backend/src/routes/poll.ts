import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";

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

          // Add the logged user as a poll participant
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

  // Route: participate in a poll
  fastify.post(
    "/polls/:id/join",
    { onRequest: [authenticate] },
    async (request, reply) => {
      // Poll code validation
      const joinPollBody = z.object({
        code: z.string(),
      });
      const { code } = joinPollBody.parse(request.body);

      // Checking if the poll exists
      const poll = await prisma.poll.findUnique({
        where: { code },

        // Checking if the logged user already is a poll participant
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      });

      if (!poll) return reply.status(400).send({ message: "Poll not found!" });

      if (poll.participants.length > 0)
        return reply.status(400).send({
          message: `${request.user.name}, you already join this poll.`,
        });

      // Delete this after implementing login with google on the web frontend
      if (!poll.ownerId) {
        await prisma.poll.update({
          where: {
            id: poll.id,
          },
          data: {
            ownerId: request.user.sub,
          },
        });
      }

      // If poll exists and the user don't is a participant
      await prisma.participant.create({
        data: {
          pollId: poll.id,
          userId: request.user.sub,
        },
      });

      return reply.status(201).send();
    }
  );
}
