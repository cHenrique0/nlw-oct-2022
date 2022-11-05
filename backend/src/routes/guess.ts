import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  // Route: Count created guesses
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  // Route: create a guess
  fastify.post(
    "/polls/:pollId/matches/:matchId/guesses",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = z.object({
        pollId: z.string(),
        matchId: z.string(),
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { pollId, matchId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_pollId: {
            pollId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant)
        return reply.status(400).send({
          message: "You're not allowed create a guess inside this poll.",
        });

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_matchId: {
            participantId: participant.id,
            matchId,
          },
        },
      });

      if (guess)
        return reply.status(400).send({
          message: "You already sent a guess to this match on this poll",
        });

      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match)
        return reply.status(400).send({
          message: "Match not found!",
        });

      if (match.date < new Date())
        return reply.status(400).send({
          message: "You cannot send guesses after the match start",
        });

      await prisma.guess.create({
        data: {
          matchId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return reply.status(201).send();
    }
  );
}
