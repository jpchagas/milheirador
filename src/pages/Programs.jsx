import React from "react";
import Article from "@/components/Article";
import GoogleAds from "@/components/GoogleAds";
import { creditCards } from "@/data/cards";
import { RANKING_PATH } from "@/utils/profile";

const cardCount = program => creditCards.filter(c => c.program === program).length;

const CardCount = ({ program }) => {
  const count = cardCount(program);
  if (count === 0) return null;
  return (
    <p className="text-sm text-muted-foreground">
      {count === 1 ? "1 cartão" : `${count} cartões`} do nosso{" "}
      <a href={RANKING_PATH}>ranking</a> {count === 1 ? "acumula" : "acumulam"} neste programa.
    </p>
  );
};

const Programs = () => (
  <Article
    title="Guia dos programas de pontos e milhas"
    intro="Os cartões de crédito brasileiros acumulam pontos em programas diferentes. Entender para onde vão os seus pontos ajuda a escolher o cartão e a aproveitar melhor cada milha."
  >
    <h2>Pontos e milhas não são a mesma coisa</h2>
    <p>Existem três tipos de programa no ranking do Milheirador:</p>
    <ul>
      <li>
        <strong>Programas de pontos independentes</strong>, como Livelo e Esfera. Eles recebem
        pontos de vários cartões e parceiros. Os pontos podem ser trocados por produtos ou
        transferidos para programas de companhias aéreas.
      </li>
      <li>
        <strong>Programas de companhias aéreas</strong>, como LATAM Pass, Smiles e Azul
        Fidelidade. Os cartões da própria companhia aérea acumulam milhas diretamente, sem
        etapa de transferência.
      </li>
      <li>
        <strong>Programas dos próprios bancos.</strong> Os pontos ficam no banco e, em geral,
        podem ser transferidos para parceiros ou trocados por produtos, cashback ou outros
        benefícios.
      </li>
    </ul>
    <p>
      Pontos em um programa independente dão mais flexibilidade, porque você escolhe a companhia
      aérea na hora de transferir. Milhas acumuladas diretamente na companhia aérea evitam a
      transferência, mas ficam presas àquele programa.
    </p>

    <h2>Livelo</h2>
    <p>
      A Livelo é um programa de pontos criado pelo Banco do Brasil e pelo Bradesco, e recebe
      pontos dos cartões desses bancos e de outros parceiros. Os pontos podem ser trocados por
      produtos e serviços ou transferidos para programas de companhias aéreas parceiras,
      geralmente na proporção de 1 ponto para 1 milha.
    </p>
    <CardCount program="livelo" />

    <h2>Esfera</h2>
    <p>
      A Esfera é o programa de pontos ligado ao Santander. Assim como a Livelo, funciona como um
      intermediário: os pontos acumulados no cartão podem ser trocados no próprio programa ou
      transferidos para companhias aéreas parceiras.
    </p>
    <CardCount program="esfera" />

    <h2>Programas dos bancos</h2>
    <p>
      Vários bancos mantêm programas próprios, em vez de enviar os pontos para a Livelo ou a
      Esfera. As regras variam muito: alguns permitem transferir para companhias aéreas na
      proporção de 1 para 1, outros exigem mais pontos por milha. No ranking, usamos a proporção
      de conversão de cada cartão para comparar todos em milhas.
    </p>
    <CardCount program="proprio" />

    <GoogleAds slot="content" />

    <h2>LATAM Pass</h2>
    <p>
      O LATAM Pass é o programa de fidelidade da LATAM Airlines. Os cartões LATAM Pass acumulam
      milhas direto no programa, que podem ser usadas em voos da LATAM e de companhias parceiras.
    </p>
    <CardCount program="latam pass" />

    <h2>Smiles</h2>
    <p>
      O Smiles é o programa de fidelidade da GOL. Além dos cartões da própria GOL, recebe
      transferências de vários programas de pontos, o que o torna uma opção comum para quem
      acumula em Livelo ou Esfera.
    </p>
    <CardCount program="smiles" />

    <h2>Azul Fidelidade</h2>
    <p>
      O Azul Fidelidade é o programa da Azul Linhas Aéreas. Os cartões do programa acumulam pontos
      diretamente na conta Azul, que podem ser usados em voos da Azul e de parceiras.
    </p>
    <CardCount program="azul fidelidade" />

    <h2>AAdvantage</h2>
    <p>
      O AAdvantage é o programa da American Airlines. É uma opção para quem viaja com frequência
      aos Estados Unidos ou voa com companhias da aliança oneworld.
    </p>
    <CardCount program="aadvantage" />

    <h2>TAP Miles&amp;Go</h2>
    <p>
      O Miles&amp;Go é o programa da TAP Air Portugal. Interessa principalmente a quem viaja para
      Portugal e para a Europa, com voos da TAP e de parceiras da Star Alliance.
    </p>
    <CardCount program="tap miles&go" />

    <h2>Como escolher</h2>
    <ul>
      <li>
        <strong>Comece pelo Índice Milheirador.</strong> Use o <a href="/">simulador</a> com o
        seu gasto real para ver quais cartões acumulam mais rápido.
      </li>
      <li>
        <strong>Pense em onde você vai usar as milhas.</strong> Acumular rápido só vale a pena se
        o programa tiver voos para os destinos que você quer.
      </li>
      <li>
        <strong>Prefira flexibilidade se estiver em dúvida.</strong> Programas de pontos
        independentes permitem escolher a companhia aérea depois, e aproveitar promoções de
        transferência.
      </li>
      <li>
        <strong>Confira a validade.</strong> Pontos e milhas expiram, com prazos que variam por
        programa e por forma de acúmulo.
      </li>
    </ul>
    <p>
      As regras dos programas mudam com frequência. Antes de transferir pontos ou trocar de
      cartão, confirme as condições atuais no site de cada programa.
    </p>
  </Article>
);

export default Programs;
