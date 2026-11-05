import React from "react";
import { creditCards } from "@/data/cards";
import { programLabel } from "@/utils/format";
import { RANKING_PATH } from "@/utils/profile";

const programs = [...new Set(creditCards.map(c => c.program))]
  .map(program => ({ program, count: creditCards.filter(c => c.program === program).length }))
  .sort((a, b) => b.count - a.count);

const steps = [
  {
    title: "Informe seus gastos",
    text: "Digite quanto você gasta por mês no cartão. A cotação do dólar já vem com a do dia, e você pode trocar pela do seu banco.",
  },
  {
    title: "Escolha o seu cartão",
    text: "Selecione o banco e o cartão que você usa hoje, com a anuidade que você paga, ou cadastre um cartão que não está na lista.",
  },
  {
    title: "Compare os indicadores",
    text: `Veja a posição do seu cartão entre os ${creditCards.length} do ranking pelo Índice Milheirador e quais geram mais milhas para o seu perfil.`,
  },
];

// Explanatory sections below the form on the home page.
const HomeGuide = () => (
  <div className="article-body">
    <h2>Como funciona</h2>
    <ol className="!list-none !pl-0 grid gap-4 sm:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="rounded-lg border p-4">
          <span className="font-heading text-2xl font-extrabold text-primary">{i + 1}</span>
          <h3 className="!pt-1">{step.title}</h3>
          <p className="text-sm text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>

    <h2>O que é o Índice Milheirador</h2>
    <p>
      Cartões diferentes pontuam de jeitos diferentes: uns dão pontos por dólar, outros por real,
      uns enviam os pontos para a Livelo ou a Esfera, outros direto para uma companhia aérea. Para
      comparar todos na mesma base, o Milheirador calcula o desembolso total em reais por milha
      gerada, já incluindo a anuidade:
    </p>
    <p>
      <code>Índice Milheirador = (gasto anual + anuidade) ÷ milhas geradas no ano</code>
    </p>
    <p>
      Quanto menor, melhor. O índice não é o preço de uma milha: o gasto também paga o que você
      comprou. Ao lado dele, o ranking mostra as milhas por real gasto e as milhas extras que cada
      real de anuidade rende em relação ao melhor cartão gratuito.
    </p>
    <p>
      Como o gasto entra na conta, o resultado muda com o seu perfil: um cartão com anuidade alta
      pode ser o melhor para quem gasta muito e um dos piores para quem gasta pouco. Veja o passo
      a passo e um exemplo completo em <a href="/como-calculamos">como calculamos</a>.
    </p>

    <h2>Programas comparados</h2>
    <p>
      O <a href={RANKING_PATH}>ranking</a> reúne {creditCards.length} cartões de{" "}
      {new Set(creditCards.map(c => c.issuer)).size} bancos, que acumulam pontos ou milhas nestes
      programas:
    </p>
    <ul>
      {programs.map(({ program, count }) => (
        <li key={program}>
          {programLabel(program)}: {count === 1 ? "1 cartão" : `${count} cartões`}
        </li>
      ))}
    </ul>
    <p>
      Não sabe a diferença entre eles? O <a href="/programas">guia dos programas</a> explica como
      cada um funciona e como escolher.
    </p>
  </div>
);

export default HomeGuide;
