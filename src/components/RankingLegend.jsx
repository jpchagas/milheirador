import React from "react";
import { cardName, formatMiles } from "@/utils/format";

// What each indicator of RankingTable means. `reference` is the free card the annuity
// indicator compares with (freeReferenceCard), or undefined when there is none.
const RankingLegend = ({ reference }) => (
  <dl className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
    <div>
      <dt className="font-medium text-foreground">Índice Milheirador</dt>
      <dd>
        Desembolso total em reais por milha gerada, incluindo compras e anuidade proporcional.
        Quanto menor, melhor. Não é o preço de mercado de uma milha.
      </dd>
    </div>
    <div>
      <dt className="font-medium text-foreground">Milhas por R$</dt>
      <dd>Quantidade de milhas geradas para cada R$ 1 em compras elegíveis. Não considera a anuidade.</dd>
    </div>
    <div>
      <dt className="font-medium text-foreground">Milhas extras por R$ de anuidade</dt>
      <dd>
        Milhas adicionais geradas por cada R$ 1 de anuidade, em comparação com o melhor cartão
        gratuito disponível
        {reference
          ? `: ${cardName(reference)}, com ${formatMiles(reference.annualMiles)} milhas/ano.`
          : ". Indisponível: nenhum cartão gratuito pontua com esse perfil."}
      </dd>
    </div>
  </dl>
);

export default RankingLegend;
