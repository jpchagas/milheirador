import { HOME_PATH, RANKING_PATH, RESULT_PATH } from "@/utils/profile";

// Every page of the site, with the <head> data that scripts/prerender.js writes into its HTML.
// `noindex` pages stay out of the sitemap and ask search engines not to index them.
export const routes = [
  {
    path: HOME_PATH,
    title: "Milheirador: quanto custa cada milha do seu cartão de crédito",
    description:
      "Compare cartões de crédito brasileiros pelo custo de cada milha acumulada, em Livelo, Esfera, LATAM Pass, Smiles, Azul Fidelidade e outros programas.",
  },
  {
    path: RESULT_PATH,
    title: "Resultado | Milheirador",
    description: "A posição do seu cartão de crédito no ranking de custo por milha.",
    noindex: true,
  },
  {
    path: RANKING_PATH,
    title: "Ranking de cartões de crédito por custo da milha | Milheirador",
    description:
      "Todos os cartões de crédito do Milheirador ordenados pelo custo de cada milha, com filtros por banco, bandeira, programa e anuidade.",
  },
  {
    path: "/como-calculamos",
    title: "Como calculamos o custo da milha | Milheirador",
    description:
      "A fórmula do custo por milha passo a passo: pontos por dólar, cotação, conversão em milhas e anuidade, com exemplos e as limitações do cálculo.",
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
    description: "Dúvidas comuns sobre o Milheirador, o custo por milha e os dados dos cartões.",
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
