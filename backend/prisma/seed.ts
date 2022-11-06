import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      avatarUrl: "https://github.com/cHenrique0.png",
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
      homeTeamCountryIsoCode: "DE",
      awayTeamCountryIsoCode: "BR",
    },
  });
  await prisma.match.create({
    data: {
      date: "2022-11-03T16:00:00.138Z",
      homeTeamCountryIsoCode: "BR",
      awayTeamCountryIsoCode: "AR",

      guesses: {
        create: {
          homeTeamGoals: 3,
          awayTeamGoals: 1,

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
  await prisma.match.create({
    data: {
      date: "2022-11-07T12:00:00.138Z",
      homeTeamCountryIsoCode: "US",
      awayTeamCountryIsoCode: "GB",
    },
  });
}

main();
