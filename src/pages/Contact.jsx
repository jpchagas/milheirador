import React from "react";
import Article from "@/components/Article";
import { CONTACT_EMAIL } from "@/site";

const Contact = () => (
  <Article
    title="Contato"
    intro="Encontrou um dado desatualizado, quer sugerir um cartão ou tem alguma dúvida? Fale com a gente."
  >
    <p>
      Escreva para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>

    <h2>Correções e novos cartões</h2>
    <p>
      Para corrigir ou incluir um cartão, envie o nome do cartão e do banco, o programa de pontos,
      quantos pontos ele acumula (por dólar ou por real), a proporção de conversão em milhas e a
      anuidade. Se puder, inclua o link da página do emissor com essas informações.
    </p>

    <h2>O que não conseguimos fazer</h2>
    <p>
      O Milheirador não é um banco e não tem acesso à sua conta, fatura ou pontos. Para pedir um
      cartão, contestar uma cobrança ou resolver problemas com pontos, fale diretamente com o seu
      banco ou com o programa de fidelidade.
    </p>
  </Article>
);

export default Contact;
