import React from "react";
import GoogleAds from "@/components/GoogleAds";
import WorthCalculator from "@/components/WorthCalculator";
import { formatBRL, formatDecimal } from "@/utils/format";
import { DEFAULT_REFERENCE_MILE_PRICE, SUGGESTED_MILE_PRICE, compareStores } from "@/utils/purchase";

// The worked example runs through the same function as the calculator, so its numbers can't drift.
const exampleCard = { accumulationFactor: 2, conversionRatio: 1, currency: "dolar" };
const exampleSettings = { card: exampleCard, dollarRate: 5.5, referenceMilePrice: DEFAULT_REFERENCE_MILE_PRICE };
const exampleStore = {
  shippingCost: 0,
  discount: 0,
  partnerConversionFactor: 1,
  eligiblePartnerAmount: null,
  cardEligibleAmount: null,
  partnerPointsMode: "additional",
};
const example = compareStores(
  [
    { ...exampleStore, id: "low", name: "Loja A", productPrice: 14.9, partnerPointsPerReal: 0 },
    { ...exampleStore, id: "partner", name: "Loja B", productPrice: 17.88, partnerPointsPerReal: 2 },
  ],
  exampleSettings
);
const exampleLow = example.stores.find(s => s.id === "low");
const examplePartner = example.stores.find(s => s.id === "partner");
const extra = examplePartner.comparison;

// /onde-comprar: the calculator on top, then the text that explains it.
const WhereToBuy = ({ cards, profile, card, ptax, onProfileChange }) => (
  <div className="mx-auto max-w-3xl space-y-8">
    <header className="space-y-3">
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
        Onde comprar: vale pagar mais pelos pontos?
      </h1>
      <p className="text-lg text-muted-foreground text-pretty">
        Vale pagar mais caro numa loja para acumular mais pontos, ou é melhor comprar mais barato e,
        se precisar, comprar milhas à parte? Compare as lojas pelo preço menos o valor estimado das
        milhas que cada compra rende.
      </p>
    </header>

    <WorthCalculator cards={cards} profile={profile} card={card} ptax={ptax} onProfileChange={onProfileChange} />

    <div className="article-body">
      <h2>Como funciona</h2>
      <p>
        Programas como Livelo e Esfera têm lojas parceiras que dão pontos por real gasto quando a
        compra começa pelo site ou aplicativo do programa. Esses pontos de campanha se somam aos que
        o cartão já dá. Para cada loja, a calculadora parte do preço final:
      </p>
      <p>
        <code>preço final = preço do produto + frete − desconto</code>
      </p>
      <p>
        Os pontos do cartão usam o acúmulo e a conversão do cartão escolhido, como no{" "}
        <a href="/ranking">ranking</a>. Os da campanha usam a conversão informada para a loja, já que
        podem ser de outro programa. Os dois viram milhas equivalentes antes de serem somados:
      </p>
      <p>
        <code>milhas = pontos do cartão × conversão do cartão + pontos do parceiro × conversão do parceiro</code>
      </p>
      <p>
        A anuidade não entra na conta: ela é um custo do cartão, não da compra, e a comparação supõe
        que você já tem o cartão.
      </p>

      <h2>Custo líquido estimado</h2>
      <p>
        Com o valor que você dá ao milheiro (1.000 milhas), as milhas de cada compra viram reais, que
        são descontados do preço final:
      </p>
      <p>
        <code>custo líquido = preço final − milhas ÷ 1.000 × valor do milheiro</code>
      </p>
      <p>
        A loja com o menor custo líquido é a melhor compra. É uma estimativa para comparar as lojas,
        não um desconto que a loja dá.
      </p>

      <h2>Custo do milheiro adicional</h2>
      <p>
        A loja de menor preço é a referência. Para cada loja mais cara, a calculadora mostra quanto
        você paga por cada 1.000 milhas a mais:
      </p>
      <p>
        <code>milheiro adicional = diferença de preço ÷ milhas a mais × 1.000</code>
      </p>
      <p>
        Se esse custo fica abaixo do valor que você dá ao milheiro, a loja mais cara compensa. Se fica
        acima, sai mais barato comprar na loja de menor preço e, se precisar, comprar as milhas à
        parte.
      </p>

      <h2>Benefício da troca e preço máximo</h2>
      <p>
        O benefício líquido de trocar a loja de menor preço por outra é o valor das milhas a mais
        menos o que você paga a mais. Positivo, a troca compensa; negativo, fique com o menor preço.
      </p>
      <p>
        O valor das milhas a mais também é o máximo que vale pagar a mais por elas. Mas, como os
        pontos crescem com o preço, a calculadora resolve a conta exata e mostra o preço final
        máximo em que cada loja ainda empata com a de menor preço.
      </p>

      <GoogleAds slot="content" />

      <h2>Exemplo</h2>
      <p>
        Um produto custa {formatBRL(exampleLow.totalPrice)} na loja A e{" "}
        {formatBRL(examplePartner.totalPrice)} na loja B, que tem uma campanha de{" "}
        {examplePartner.partnerPointsPerReal} pontos por real. O cartão dá{" "}
        {exampleCard.accumulationFactor} pontos por dólar, com o dólar a{" "}
        {formatBRL(exampleSettings.dollarRate)}, e o milheiro vale{" "}
        {formatBRL(exampleSettings.referenceMilePrice)}:
      </p>
      <ul>
        <li>
          <strong>Loja A:</strong> {formatDecimal(exampleLow.totalMiles)} milhas do cartão, que valem{" "}
          {formatBRL(exampleLow.estimatedMilesValue)}. Custo líquido:{" "}
          {formatBRL(exampleLow.estimatedNetCost)}.
        </li>
        <li>
          <strong>Loja B:</strong> {formatDecimal(examplePartner.cardMiles)} milhas do cartão +{" "}
          {formatDecimal(examplePartner.partnerMiles)} da campanha ={" "}
          {formatDecimal(examplePartner.totalMiles)} milhas, que valem{" "}
          {formatBRL(examplePartner.estimatedMilesValue)}. Custo líquido:{" "}
          {formatBRL(examplePartner.estimatedNetCost)}.
        </li>
      </ul>
      <p>
        A loja B custa {formatBRL(extra.additionalCost)} a mais por{" "}
        {formatDecimal(extra.additionalMiles)} milhas a mais, um milheiro adicional de{" "}
        <strong>{formatBRL(extra.additionalThousandMilesCost)}</strong>, bem acima dos{" "}
        {formatBRL(exampleSettings.referenceMilePrice)} de referência. As milhas a mais valem{" "}
        {formatBRL(extra.additionalMilesValue)}, então a loja A sai{" "}
        {formatBRL(-extra.netSwitchBenefit)} mais vantajosa. A loja B só compensaria com preço final
        de até {formatBRL(extra.maxWorthPrice)}.
      </p>

      <h2>Quanto vale o milheiro?</h2>
      <p>
        Não existe um valor único: depende de como você usa as milhas. Uma forma de estimar é dividir
        o preço em reais de uma passagem que você emitiria pelas milhas que ela custa, vezes 1.000.
        Outra é olhar quanto os programas cobram para vender pontos. A calculadora começa com{" "}
        {formatBRL(DEFAULT_REFERENCE_MILE_PRICE)}, e valores entre{" "}
        {formatBRL(SUGGESTED_MILE_PRICE.min)} e {formatBRL(SUGGESTED_MILE_PRICE.max)} são um bom
        ponto de partida. Não é uma cotação garantida de compra, venda ou resgate.
      </p>

      <h2>Cuidados</h2>
      <ul>
        <li>
          <strong>Acúmulo das pontuações:</strong> a calculadora soma os pontos da campanha aos do
          cartão. Confira no regulamento se as duas pontuações acumulam.
        </li>
        <li>
          <strong>Valores que pontuam:</strong> o frete ou parte da compra podem não pontuar. Quando
          você não informa, usamos o preço final.
        </li>
        <li>
          <strong>Programas diferentes:</strong> se a campanha é de um programa e o cartão de outro,
          ajuste a conversão do parceiro para milhas equivalentes.
        </li>
        <li>
          <strong>Mesmo produto:</strong> compare o mesmo produto, com prazo de entrega, garantia e
          condições equivalentes. Os pontos de campanha também costumam levar semanas para cair.
        </li>
      </ul>
    </div>
  </div>
);

export default WhereToBuy;
