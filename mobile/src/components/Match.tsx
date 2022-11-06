import { Button, HStack, Text, useTheme, VStack } from "native-base";
import { X, Check } from "phosphor-react-native";
import { getName } from "country-list";
import dayjs from "dayjs";

import { Team } from "./Team";

interface GuessProps {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface MatchProps {
  id: string;
  date: string;
  homeTeamCountryIsoCode: string;
  awayTeamCountryIsoCode: string;
  guess: null | GuessProps;
}

interface Props {
  data: MatchProps;
  onGuessConfirm: () => void;
  setHomeTeamGoals: (value: string) => void;
  setAwayTeamGoals: (value: string) => void;
}

export function Match({
  data,
  setHomeTeamGoals,
  setAwayTeamGoals,
  onGuessConfirm,
}: Props) {
  const { colors, sizes } = useTheme();

  const when = dayjs(data.date).format("DD/MM/YYYY [às] HH:mm");

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <Text color="gray.100" fontFamily="heading" fontSize="sm">
        {getName(data.homeTeamCountryIsoCode)} vs.{" "}
        {getName(data.awayTeamCountryIsoCode)}
      </Text>

      <Text color="gray.200" fontSize="xs">
        {when}
      </Text>

      <HStack mt={4} w="full" justifyContent="center" alignItems="center">
        <Team
          code={data.homeTeamCountryIsoCode}
          position="right"
          onChangeText={setHomeTeamGoals}
          value={data.guess?.homeTeamGoals.toString() || ""}
        />

        <X color={colors.gray[300]} size={sizes[6]} />

        <Team
          code={data.awayTeamCountryIsoCode}
          position="left"
          onChangeText={setAwayTeamGoals}
          value={data.guess?.awayTeamGoals.toString() || ""}
        />
      </HStack>

      {!data.guess && (
        <Button
          size="xs"
          w="full"
          bgColor="green.500"
          mt={4}
          onPress={onGuessConfirm}
        >
          <HStack alignItems="center">
            <Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
              CONFIRMAR PALPITE
            </Text>

            <Check color={colors.white} size={sizes[4]} />
          </HStack>
        </Button>
      )}
    </VStack>
  );
}
