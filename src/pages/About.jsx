import React from "react";
import Article from "@/components/Article";
import { creditCards } from "@/data/cards";

const About = () => (
  <Article
    title="Sobre o Milheirador"
    intro="O Milheirador é um comparador independente de cartões de crédito para quem quer acumular milhas aéreas."
  >
    <h2>Por que o site existe</h2>
    <p>
      Cada banco divulga a pontuação de um jeito: pontos por dólar, pontos por real, programas
      próprios com proporções diferentes de conversão. Comparar cartões assim exige fazer contas
      que quase ninguém tem paciência de fazer. O Milheirador faz essas contas e reduz tudo a um
      número só, o custo de cada milha, calculado para o seu gasto mensal.
    </p>

    <h2>O que você encontra aqui</h2>
    <ul>
      <li>
        Um <a href="/">simulador</a> que mostra a posição do seu cartão entre os{" "}
        {creditCards.length} cartões do ranking.
      </li>
      <li>
        O <a href="/ranking">ranking completo</a>, com filtros por banco, bandeira, programa e
        anuidade.
      </li>
      <li>
        A explicação de <a href="/como-calculamos">como calculamos</a> o custo da milha, com
        exemplos.
      </li>
      <li>
        Um <a href="/programas">guia dos programas</a> de pontos e milhas.
      </li>
    </ul>

    <h2>Como os dados são mantidos</h2>
    <p>
      Os dados de cada cartão (fator de acúmulo, programa, conversão em milhas e anuidade) são
      coletados manualmente das informações públicas dos emissores e revisados periodicamente.
      Não recebemos dados diretamente dos bancos. Se encontrar algo desatualizado,{" "}
      <a href="/contato">avise a gente</a>.
    </p>

    <h2>Independência</h2>
    <p>
      O ranking é calculado pela mesma fórmula para todos os cartões, e nenhum banco paga para
      aparecer em uma posição melhor. O site se mantém com anúncios exibidos pelo Google, que são
      identificados como publicidade e não influenciam o ranking.
    </p>
    <p>
      O Milheirador tem caráter informativo e não é uma recomendação financeira. Confirme sempre
      as condições do cartão com o emissor antes de decidir.
    </p>
  </Article>
);

export default About;
