import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RankingTable from "@/components/RankingTable";
import { formatBRL } from "@/utils/format";

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
          Os {TOP} cartões com a milha mais barata para um gasto de{" "}
          {formatBRL(settings.monthlySpend)} por mês e dólar a {formatBRL(settings.dollarRate)}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RankingTable rows={rows} highlightId={current.id} showGaps />
      </CardContent>
    </Card>
  );
};

export default TopRanking;
