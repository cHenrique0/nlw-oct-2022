import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(fastify: FastifyInstance) {
  // jwt validation
  fastify.get(
    "/me",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      await request.jwtVerify();

      return { user: request.user };
    }
  );

  // Create a user
  fastify.post("/users", async (request) => {
    // Validations for user access token
    const createUserBody = z.object({
      access_token: z.string(),
    });

    // Getting the user access token
    const { access_token } = createUserBody.parse(request.body);

    // Google API request
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });

    const userInfo = userInfoSchema.parse(userData);

    // Find user by google id
    let user = await prisma.user.findUnique({
      where: { googleId: userInfo.id },
    });

    // Create a user if don't exists
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        },
      });
    }

    // Create a jwt token for user
    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "2 days",
      }
    );

    return { token };
  });
}
