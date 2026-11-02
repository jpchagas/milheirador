import React from "react";
import Article from "@/components/Article";
import GoogleAds from "@/components/GoogleAds";
import { evaluateCard, milesPerReal } from "@/utils/rankMyCard";
import { formatBRL, formatMiles } from "@/utils/format";

// The worked example runs through the same functions as the ranking, so its numbers can't drift.
const settings = { monthlySpend: 5000, dollarRate: 5.5 };
const lowSpend = { ...settings, monthlySpend: 2000 };
const premium = { accumulationFactor: 2, conversionRatio: 1, currency: "dolar", annuity: 1200 };
const basic = { accumulationFactor: 1, conversionRatio: 1, currency: "dolar", annuity: 0 };

const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 });

const exampleRows = [
  { name: "Cartão A", card: premium, earns: "2 pontos por US$", annuity: "R$ 1.200 por ano" },
  { name: "Cartão B", card: basic, earns: "1 ponto por US$", annuity: "sem anuidade" },
].map(row => ({ ...row, result: evaluateCard(row.card, settings) }));

const HowWeCalculate = () => (
  <Article
    title="Como calculamos o custo da milha"
    intro="O Milheirador ordena os cartões pelo custo da milha: quantos reais você precisa gastar no cartão, já somando a anuidade, para ganhar cada milha. Quanto menor o custo, mais rápido o cartão transforma seus gastos em milhas."
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

    <h2>Passo 2: de pontos para milhas</h2>
    <p>
      Pontos de programas como Livelo e Esfera não são milhas: eles precisam ser transferidos para
      uma companhia aérea. Usamos a proporção dessa transferência (na maioria dos casos, 1 ponto
      vira 1 milha). Cartões de companhias aéreas acumulam milhas diretamente.
    </p>
    <p>
      <code>milhas por real = pontos por real × milhas por ponto</code>
    </p>

    <h2>Passo 3: milhas acumuladas no ano</h2>
    <p>
      Com o seu gasto mensal, calculamos quantas milhas o cartão gera em doze meses:
    </p>
    <p>
      <code>milhas por ano = gasto mensal × 12 × milhas por real</code>
    </p>

    <h2>Passo 4: custo por milha</h2>
    <p>
      Por fim, dividimos tudo o que você paga no ano, o gasto mais a anuidade, pelas milhas
      acumuladas:
    </p>
    <p>
      <code>custo por milha = (gasto anual + anuidade) ÷ milhas por ano</code>
    </p>
    <p>
      O ranking coloca primeiro os cartões com o menor custo por milha para o seu perfil de gastos.
    </p>

    <GoogleAds slot="content" />

    <h2>Exemplo</h2>
    <p>
      Imagine alguém que gasta {formatBRL(settings.monthlySpend)} por mês, com o dólar do cartão a{" "}
      {formatBRL(settings.dollarRate)}, comparando dois cartões que transferem pontos na proporção
      de 1 para 1:
    </p>
    <ul>
      {exampleRows.map(({ name, earns, annuity, card, result }) => (
        <li key={name}>
          <strong>{name}</strong>, {earns}, {annuity}: rende{" "}
          {decimal.format(milesPerReal(card, settings.dollarRate))} milha por real, ou{" "}
          {formatMiles(result.annualMiles)} milhas por ano. Custo por milha:{" "}
          <strong>{formatBRL(result.costPerMile)}</strong>.
        </li>
      ))}
    </ul>
    <p>
      Mesmo cobrando {formatBRL(premium.annuity)} de anuidade, o cartão A gera milhas por cerca da
      metade do custo do cartão B, porque acumula o dobro de pontos. Com um gasto menor, de{" "}
      {formatBRL(lowSpend.monthlySpend)} por mês, o custo do cartão A sobe para{" "}
      {formatBRL(evaluateCard(premium, lowSpend).costPerMile)} e o do cartão B continua em{" "}
      {formatBRL(evaluateCard(basic, lowSpend).costPerMile)}. A anuidade pesa mais quanto menor for
      o gasto, mas costuma pesar menos que a diferença de pontuação.
    </p>
    <p>
      Repare também que, num cartão sem anuidade, o custo por milha é simplesmente a cotação do
      dólar dividida pelos pontos por dólar. É uma boa forma de conferir as contas de cabeça.
    </p>

    <h2>O que o cálculo não considera</h2>
    <p>
      O custo por milha é uma comparação simples e transparente, mas não é a única coisa que
      importa na escolha de um cartão. O ranking ainda não leva em conta:
    </p>
    <ul>
      <li>
        <strong>Promoções de transferência:</strong> os programas de pontos oferecem com
        frequência bônus para transferir pontos às companhias aéreas, o que pode aumentar bastante
        as milhas recebidas.
      </li>
      <li>
        <strong>Isenção de anuidade:</strong> muitos bancos dão desconto ou isenção na anuidade
        para quem gasta um valor mínimo ou tem investimentos. Usamos a anuidade cheia divulgada.
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
