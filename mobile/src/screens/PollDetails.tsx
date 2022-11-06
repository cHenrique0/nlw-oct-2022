import { useEffect, useState } from "react";
import { Share } from "react-native";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Option } from "../components/Option";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { PollPros } from "../components/PollCard";
import { PollHeader } from "../components/PoolHeader";
import { EmptyMyPollList } from "../components/EmptyMyPollList";

interface RouteParams {
  id: string;
}

enum OptionSelected {
  ranking = "ranking",
  guesses = "guesses",
}

export function PollDetails() {
  const [optionSelected, setOptionSelected] = useState<OptionSelected>(
    OptionSelected.ranking
  );
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PollPros>({} as PollPros);

  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function fetchPollDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${id}`);
      setPollDetails(response.data.poll);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os detalhes do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code,
    });
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pollDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {pollDetails._count?.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PollHeader data={pollDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Classificação"
              isSelected={optionSelected === OptionSelected.ranking}
              onPress={() => setOptionSelected(OptionSelected.ranking)}
            />
            <Option
              title="Seus palpites"
              isSelected={optionSelected === OptionSelected.guesses}
              onPress={() => setOptionSelected(OptionSelected.guesses)}
            />
          </HStack>

          <Guesses pollId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPollList code={pollDetails.code} />
      )}
    </VStack>
  );
}
