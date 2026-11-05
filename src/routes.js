import { HOME_PATH, PURCHASE_PATH, RANKING_PATH, RESULT_PATH } from "@/utils/profile";

// Every page of the site, with the <head> data that scripts/prerender.js writes into its HTML.
// `noindex` pages stay out of the sitemap and ask search engines not to index them.
export const routes = [
  {
    path: HOME_PATH,
    title: "Milheirador: qual cartão de crédito gera mais milhas para o seu gasto",
    description:
      "Compare cartões de crédito brasileiros pelo Índice Milheirador, o desembolso por milha gerada, e pelas milhas por real gasto, em Livelo, Esfera, LATAM Pass, Smiles, Azul Fidelidade e outros programas.",
  },
  {
    path: RESULT_PATH,
    title: "Resultado | Milheirador",
    description: "A posição do seu cartão de crédito no ranking do Índice Milheirador.",
    noindex: true,
  },
  {
    path: RANKING_PATH,
    title: "Ranking de cartões de crédito por milhas geradas | Milheirador",
    description:
      "Todos os cartões de crédito do Milheirador ordenados pelo Índice Milheirador, por milhas por real gasto ou por milhas extras por real de anuidade, com filtros por banco, bandeira, programa e anuidade.",
  },
  {
    path: PURCHASE_PATH,
    title: "Onde comprar: vale pagar mais pelos pontos? | Milheirador",
    description:
      "Compare lojas pelo preço menos o valor dos pontos: veja se compensa pagar mais numa loja parceira da Livelo ou da Esfera pelos pontos extras.",
  },
  {
    path: "/como-calculamos",
    title: "Como calculamos o Índice Milheirador | Milheirador",
    description:
      "Os indicadores do ranking passo a passo: milhas por real gasto, milhas extras por real de anuidade e Índice Milheirador, com exemplos e as limitações do cálculo.",
  },
  {
    path: "/programas",
    title: "Guia dos programas de pontos e milhas | Milheirador",
    description:
      "Como funcionam Livelo, Esfera, LATAM Pass, Smiles, Azul Fidelidade, AAdvantage, TAP Miles&Go e os programas dos próprios bancos.",
  },
  {
    path: "/perguntas-frequentes",
    title: "Perguntas frequentes | Milheirador",
    description: "Dúvidas comuns sobre o Milheirador, o Índice Milheirador e os dados dos cartões.",
  },
  {
    path: "/sobre",
    title: "Sobre o Milheirador",
    description: "O que é o Milheirador, como os dados são mantidos e como o site se sustenta.",
  },
  {
    path: "/privacidade",
    title: "Política de privacidade | Milheirador",
    description: "Quais dados o Milheirador usa, como funcionam os cookies de anúncios e quais são os seus direitos.",
  },
  {
    path: "/contato",
    title: "Contato | Milheirador",
    description: "Fale com o Milheirador para corrigir dados de cartões, sugerir melhorias ou tirar dúvidas.",
  },
];
