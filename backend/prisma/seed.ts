import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      avatarUrl: "",
    },
  });

  // Create a poll
  const poll = await prisma.poll.create({
    data: {
      title: "Example poll",
      code: "BOL123",
      ownerId: user.id,

      // Relation with user
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  // Create matches
  await prisma.match.create({
    data: {
      date: "2022-11-02T12:00:00.138Z",
      firstTeamCountryIsoCode: "DE",
      secondTeamCountryIsoCode: "BR",
    },
  });
  await prisma.match.create({
    data: {
      date: "2022-11-03T16:00:00.138Z",
      firstTeamCountryIsoCode: "BR",
      secondTeamCountryIsoCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_pollId: {
                userId: user.id,
                pollId: poll.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
