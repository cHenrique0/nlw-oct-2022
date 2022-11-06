import { useEffect, useState } from "react";
import { useToast, FlatList } from "native-base";

import { api } from "../services/api";

import { Loading } from "./Loading";
import { EmptyMyPollList } from "./EmptyMyPollList";
import { Match, MatchProps } from "../components/Match";

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<MatchProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  async function fetchMatches() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${pollId}/matches`);
      setMatches(response.data.matches);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar as partidas.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(matchId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar da partida.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/polls/${pollId}/matches/${matchId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite enviado com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      fetchMatches();
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível enviar seu palpite.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
    }
  }

  useEffect(() => {
    fetchMatches();
  }, [pollId]);

  if (isLoading) return <Loading />;

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Match
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
