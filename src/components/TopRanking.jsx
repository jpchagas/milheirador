import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RankingLegend from "@/components/RankingLegend";
import RankingTable from "@/components/RankingTable";
import { formatBRL } from "@/utils/format";
import { freeReferenceCard } from "@/utils/rankMyCard";

const TOP = 3;

// The top of the ranking plus the user's card, wherever it landed.
const TopRanking = ({ rankedCards, current, settings }) => {
  const position = rankedCards.indexOf(current) + 1;
  const rows = rankedCards.slice(0, TOP).map((card, i) => ({ card, position: i + 1 }));
  if (position > TOP) rows.push({ card: current, position });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Seu cartão está em {position}º de {rankedCards.length}
        </CardTitle>
        <CardDescription>
          Os {TOP} cartões com o menor Índice Milheirador (desembolso por milha gerada) para um
          gasto de {formatBRL(settings.monthlySpend)} por mês e dólar a {formatBRL(settings.dollarRate)}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RankingTable rows={rows} highlightId={current.id} showGaps />
        <RankingLegend reference={freeReferenceCard(rankedCards)} />
      </CardContent>
    </Card>
  );
};

export default TopRanking;
