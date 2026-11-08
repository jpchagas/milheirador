import React from "react";
import Article from "@/components/Article";
import GoogleAds from "@/components/GoogleAds";
import { creditCards } from "@/data/cards";
import { RANKING_PATH } from "@/utils/profile";

const questions = [
  {
    q: "O Milheirador é gratuito?",
    a: (
      <p>
        Sim. O site é gratuito e se mantém com anúncios exibidos pelo Google. Não é preciso criar
        conta nem informar dados pessoais.
      </p>
    ),
  },
  {
    q: "O que é o Índice Milheirador?",
    a: (
      <p>
        É o desembolso total em reais por milha gerada: o gasto do ano mais a anuidade, dividido
        pelas milhas que o cartão gera. Quanto menor, melhor. Ele não é o preço de uma milha,
        porque o gasto também paga os produtos e serviços que você comprou. A fórmula completa está
        em <a href="/como-calculamos">como calculamos</a>.
      </p>
    ),
  },
  {
    q: "O que são as milhas extras por real de anuidade?",
    a: (
      <p>
        Mostram quantas milhas a mais cada real de anuidade rende em comparação com o cartão
        gratuito que gera mais milhas para o seu gasto. Positivo, a anuidade compra milhas extras;
        negativo, o cartão pago gera menos que o gratuito. Para cartões sem anuidade, não se aplica.
        Use junto com os outros indicadores, não sozinho.
      </p>
    ),
  },
  {
    q: "Tenho isenção de anuidade. Como fica?",
    a: (
      <p>
        Ao escolher o seu cartão no simulador, informe a anuidade que você paga, ou 0 se tiver
        isenção. Os indicadores do seu cartão passam a usar esse valor. Os outros cartões do
        ranking continuam com a anuidade cheia.
      </p>
    ),
  },
  {
    q: "Por que o simulador pede a cotação do dólar?",
    a: (
      <p>
        Porque a maioria dos cartões pontua por dólar gasto, mesmo em compras em reais. O banco
        converte o valor da compra pela cotação dele, e quanto mais alta a cotação, menos pontos
        cada real rende. O campo já vem preenchido com a cotação PTAX de venda do dia, publicada
        pelo Banco Central. Os bancos costumam cobrar um pouco acima dela, então, se souber,
        use a cotação que aparece na sua fatura.
      </p>
    ),
  },
  {
    q: "Meu cartão não está na lista. O que faço?",
    a: (
      <p>
        No formulário da página inicial, clique em “Meu cartão não está na lista” e informe o
        banco, os pontos acumulados, a conversão em milhas e a anuidade. O cartão entra no ranking
        junto com os outros. Se quiser que ele seja incluído para todos, <a href="/contato">nos
        envie os dados</a>.
      </p>
    ),
  },
  {
    q: "Os dados dos cartões estão atualizados?",
    a: (
      <p>
        Os dados são coletados manualmente das condições divulgadas pelos emissores e revisados
        periodicamente, mas bancos mudam pontuação e anuidade sem aviso. Confirme sempre com o seu
        banco antes de tomar uma decisão.
      </p>
    ),
  },
  {
    q: "O ranking considera promoções de transferência e isenção de anuidade?",
    a: (
      <p>
        Ainda não. Usamos o acúmulo padrão e a anuidade cheia de cada cartão, para comparar todos
        nas mesmas condições. Promoções e isenções podem deixar um cartão bem mais vantajoso para
        você.
      </p>
    ),
  },
  {
    q: "Um cartão com anuidade alta pode valer a pena?",
    a: (
      <p>
        Pode. Para quem gasta bastante, um cartão que acumula o dobro de pontos costuma compensar
        a anuidade. Para quem gasta pouco, a anuidade pesa mais. O simulador mostra exatamente
        isso para o seu gasto.
      </p>
    ),
  },
  {
    q: "Quais cartões e programas estão no ranking?",
    a: (
      <p>
        Hoje são {creditCards.length} cartões de{" "}
        {new Set(creditCards.map(c => c.issuer)).size} bancos, com pontos na Livelo, na Smiles e
        nos programas dos próprios bancos. Veja todos no <a href={RANKING_PATH}>ranking completo</a> e entenda
        cada programa no <a href="/programas">guia dos programas</a>.
      </p>
    ),
  },
  {
    q: "Os valores que eu digito ficam salvos?",
    a: (
      <p>
        Não. O cálculo acontece no seu navegador e não guardamos o que você digita. Os valores
        ficam no endereço da página para que você possa voltar ou compartilhar o resultado.
        Detalhes na <a href="/privacidade">política de privacidade</a>.
      </p>
    ),
  },
];

const question = ({ q, a }) => (
  <section key={q} className="space-y-2">
    <h2>{q}</h2>
    {a}
  </section>
);

// The ad sits halfway down, between two questions.
const Faq = () => (
  <Article
    title="Perguntas frequentes"
    intro="Respostas para as dúvidas mais comuns sobre o Milheirador e o Índice Milheirador."
  >
    {questions.slice(0, 5).map(question)}
    <GoogleAds slot="content" />
    {questions.slice(5).map(question)}
  </Article>
);

export default Faq;
