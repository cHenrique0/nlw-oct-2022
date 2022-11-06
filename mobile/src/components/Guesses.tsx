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
  const [homeTeamGoals, setHomeTeamGoals] = useState("");
  const [awayTeamGoals, setAwayTeamGoals] = useState("");

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
      if (!homeTeamGoals.trim() || !awayTeamGoals.trim()) {
        return toast.show({
          title: "Informe o placar da partida.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/polls/${pollId}/matches/${matchId}/guesses`, {
        homeTeamGoals: Number(homeTeamGoals),
        awayTeamGoals: Number(awayTeamGoals),
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
          setHomeTeamGoals={setHomeTeamGoals}
          setAwayTeamGoals={setAwayTeamGoals}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
