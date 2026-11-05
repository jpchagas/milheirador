import React from "react";
import Article from "@/components/Article";
import GoogleAds from "@/components/GoogleAds";
import { rankCards } from "@/utils/rankMyCard";
import {
  formatBRL,
  formatFeeEfficiency,
  formatIndex,
  formatMiles,
  formatMilesPerReal,
} from "@/utils/format";

// The worked example runs through the same functions as the ranking, so its numbers can't drift.
const settings = { monthlySpend: 5000, dollarRate: 5.5 };
const lowSpend = { ...settings, monthlySpend: 2000 };
const premium = { id: "a", accumulationFactor: 2, conversionRatio: 1, currency: "dolar", annuity: 1200 };
const basic = { id: "b", accumulationFactor: 1, conversionRatio: 1, currency: "dolar", annuity: 0 };

const byId = ranked => Object.fromEntries(ranked.map(card => [card.id, card]));
const example = byId(rankCards([premium, basic], settings));
const exampleLow = byId(rankCards([premium, basic], lowSpend));

const exampleRows = [
  { name: "Cartão A", card: example.a, earns: "2 pontos por US$", annuity: "R$ 1.200 por ano" },
  { name: "Cartão B", card: example.b, earns: "1 ponto por US$", annuity: "sem anuidade" },
];

const HowWeCalculate = () => (
  <Article
    title="Como calculamos o Índice Milheirador"
    intro="O ranking compara os cartões por três indicadores: milhas por real gasto, milhas extras por real de anuidade e o Índice Milheirador, que mede o desembolso por milha gerada. Todos usam a mesma base anual, o seu gasto mensal e a anuidade que você efetivamente paga."
  >
    <h2>Passo 1: pontos por real gasto</h2>
    <p>
      A maioria dos cartões divulga o acúmulo em <strong>pontos por dólar</strong>, mesmo nas
      compras em reais. Para saber quantos pontos cada real rende, o valor gasto é convertido pela
      cotação do dólar que o banco usa no cartão, que costuma ser um pouco maior que o dólar
      comercial:
    </p>
    <p>
      <code>pontos por real = pontos por dólar ÷ cotação do dólar</code>
    </p>
    <p>
      Alguns cartões pontuam diretamente por real gasto. Nesse caso, não há conversão. É por isso
      que o formulário pede a cotação: quanto mais alto o dólar, menos pontos os cartões que
      pontuam em dólar acumulam por real.
    </p>

    <h2>Passo 2: milhas por R$ 1 gasto</h2>
    <p>
      Pontos de programas como Livelo e Esfera não são milhas: eles precisam ser transferidos para
      uma companhia aérea. Usamos a proporção dessa transferência (na maioria dos casos, 1 ponto
      vira 1 milha). Cartões de companhias aéreas acumulam milhas diretamente. O resultado é o
      primeiro indicador do ranking:
    </p>
    <p>
      <code>milhas por real = pontos por real × milhas por ponto</code>
    </p>
    <p>
      Ele mede só a eficiência de acúmulo: quanto maior, mais milhas cada real em compras
      elegíveis gera. A anuidade não entra.
    </p>

    <h2>Passo 3: milhas geradas no ano</h2>
    <p>Com o seu gasto mensal, calculamos quantas milhas o cartão gera em doze meses:</p>
    <p>
      <code>milhas por ano = gasto mensal × 12 × milhas por real</code>
    </p>

    <h2>Passo 4: Índice Milheirador</h2>
    <p>
      O Índice Milheirador divide tudo o que passa pelo cartão no ano, o gasto mais a anuidade,
      pelas milhas geradas:
    </p>
    <p>
      <code>Índice Milheirador = (gasto anual + anuidade) ÷ milhas por ano</code>
    </p>
    <p>
      É o desembolso total em reais por milha gerada. Quanto menor, melhor, e o ranking começa pelo
      menor índice. Ele <strong>não é o preço de uma milha</strong>: o gasto no cartão também paga
      os produtos e serviços que você comprou, então o índice não deve ser comparado com o preço de
      compra ou venda de milhas.
    </p>

    <GoogleAds slot="content" />

    <h2>Passo 5: milhas extras por R$ 1 de anuidade</h2>
    <p>
      Vale a pena pagar anuidade? Para responder, comparamos cada cartão pago com uma referência: o
      cartão sem anuidade que gera mais milhas no ano para o seu perfil, com o mesmo gasto e a
      mesma cotação.
    </p>
    <p>
      <code>milhas extras por real de anuidade = (milhas do cartão − milhas da referência) ÷ anuidade</code>
    </p>
    <p>
      Um resultado positivo diz quantas milhas a mais cada real de anuidade compra. Zero significa
      que o cartão pago gera as mesmas milhas que o gratuito, e um resultado negativo, que gera
      menos. Para cartões sem anuidade, o indicador não se aplica. Ele não deve ser usado sozinho
      para escolher o melhor cartão, porque ignora quanto cada cartão gera em relação ao gasto.
    </p>

    <h2>Exemplo</h2>
    <p>
      Imagine alguém que gasta {formatBRL(settings.monthlySpend)} por mês, com o dólar do cartão a{" "}
      {formatBRL(settings.dollarRate)}, comparando dois cartões que transferem pontos na proporção
      de 1 para 1:
    </p>
    <ul>
      {exampleRows.map(({ name, earns, annuity, card }) => (
        <li key={name}>
          <strong>{name}</strong>, {earns}, {annuity}: {formatMilesPerReal(card.milesPerReal)} milha
          por real, ou {formatMiles(card.annualMiles)} milhas por ano. Índice Milheirador:{" "}
          <strong>{formatIndex(card.milheiradorIndex)}</strong>.
        </li>
      ))}
    </ul>
    <p>
      Com o cartão B como referência gratuita, o cartão A gera{" "}
      {formatMiles(example.a.annualMiles - example.b.annualMiles)} milhas a mais por{" "}
      {formatBRL(premium.annuity)} de anuidade:{" "}
      <strong>{formatFeeEfficiency(example.a.additionalMilesPerFeeReal)}</strong> milhas extras por
      real de anuidade.
    </p>
    <p>
      Com um gasto menor, de {formatBRL(lowSpend.monthlySpend)} por mês, o índice do cartão A sobe
      para {formatIndex(exampleLow.a.milheiradorIndex)} e o do cartão B continua em{" "}
      {formatIndex(exampleLow.b.milheiradorIndex)}, e as milhas extras por real de anuidade caem para{" "}
      {formatFeeEfficiency(exampleLow.a.additionalMilesPerFeeReal)}. A anuidade pesa mais quanto
      menor for o gasto.
    </p>
    <p>
      Repare também que, num cartão sem anuidade, o índice é simplesmente a cotação do dólar
      dividida pelos pontos por dólar. É uma boa forma de conferir as contas de cabeça.
    </p>

    <h2>Anuidade efetiva</h2>
    <p>
      Os indicadores usam a anuidade que você efetivamente paga. Ao escolher o seu cartão no
      formulário, você pode informar a sua anuidade, inclusive zero se tiver isenção. Os demais
      cartões do ranking usam a anuidade cheia divulgada pelo banco.
    </p>

    <h2>O que o cálculo não considera</h2>
    <p>
      Os indicadores são comparações simples e transparentes, mas não são a única coisa que
      importa na escolha de um cartão. O ranking ainda não leva em conta:
    </p>
    <ul>
      <li>
        <strong>Promoções de transferência:</strong> os programas de pontos oferecem com
        frequência bônus para transferir pontos às companhias aéreas, o que pode aumentar bastante
        as milhas recebidas.
      </li>
      <li>
        <strong>Isenção dos outros cartões:</strong> muitos bancos dão desconto ou isenção na
        anuidade para quem gasta um valor mínimo ou tem investimentos. Fora o seu cartão, usamos a
        anuidade cheia divulgada.
      </li>
      <li>
        <strong>Compras internacionais:</strong> alguns cartões pontuam mais em compras no
        exterior. Por enquanto, o cálculo considera apenas o acúmulo em compras nacionais.
      </li>
      <li>
        <strong>Valor de cada milha:</strong> uma milha de um programa não vale necessariamente o
        mesmo que a de outro, porque as passagens custam quantidades diferentes de milhas em cada
        companhia.
      </li>
      <li>
        <strong>Validade e regras:</strong> prazos de expiração dos pontos, limites de
        transferência e pontuação em categorias específicas variam por programa e por cartão.
      </li>
      <li>
        <strong>Outros benefícios:</strong> salas VIP, seguros de viagem, cashback e outros
        serviços do cartão.
      </li>
    </ul>

    <h2>De onde vêm os dados</h2>
    <p>
      Os fatores de acúmulo, as proporções de conversão e as anuidades vêm das condições
      divulgadas pelos emissores e são atualizados manualmente. As condições mudam com frequência,
      então confirme os valores com o seu banco antes de pedir ou cancelar um cartão. Se encontrar
      um dado desatualizado, <a href="/contato">fale com a gente</a>.
    </p>
  </Article>
);

export default HowWeCalculate;
