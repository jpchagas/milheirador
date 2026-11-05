import React from "react";
import Article from "@/components/Article";
import { CONTACT_EMAIL, PRIVACY_UPDATED } from "@/site";

const Privacy = () => (
  <Article
    title="Política de privacidade"
    intro={`Esta política explica quais dados o Milheirador usa e como funcionam os cookies de anúncios. Última atualização: ${PRIVACY_UPDATED}.`}
  >
    <h2>Dados que você informa</h2>
    <p>
      O simulador não tem cadastro e não pede dados pessoais. O gasto mensal, a cotação do dólar e
      o cartão que você escolhe são processados no seu navegador. Esses valores ficam no endereço
      (URL) da página, para que você possa voltar ao resultado ou compartilhá-lo, mas o
      Milheirador não os armazena em nenhum banco de dados.
    </p>

    <h2>Cotação do dólar</h2>
    <p>
      Para preencher a cotação do dia, o seu navegador consulta a API pública do Banco Central do
      Brasil. Essa consulta não leva nenhum dado que você informou, apenas o pedido da cotação,
      e, como em qualquer acesso a um site, o Banco Central recebe o endereço IP do seu
      dispositivo.
    </p>

    <h2>Preferências salvas no navegador</h2>
    <p>
      Se você escolher o tema claro ou escuro, essa preferência é guardada no armazenamento local
      do seu navegador (localStorage), assim como a última cotação do dólar consultada, para não
      repetir a consulta a cada página. Nada disso é enviado para nós, e tudo pode ser apagado a
      qualquer momento nas configurações do navegador.
    </p>

    <h2>Anúncios e cookies</h2>
    <p>
      O Milheirador exibe anúncios do Google AdSense. Sobre esses anúncios:
    </p>
    <ul>
      <li>
        Fornecedores terceiros, incluindo o Google, usam cookies para veicular anúncios com base
        em visitas anteriores do usuário a este e a outros sites.
      </li>
      <li>
        Com os cookies de publicidade, o Google e os parceiros dele podem veicular anúncios para
        você com base nas suas visitas a este site e a outros sites na Internet.
      </li>
      <li>
        Você pode desativar a publicidade personalizada nas{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          configurações de anúncios do Google
        </a>
        . Também é possível desativar cookies de outros fornecedores em{" "}
        <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
          aboutads.info
        </a>
        .
      </li>
    </ul>
    <p>
      Saiba mais sobre{" "}
      <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
        como o Google usa as informações de sites que usam os serviços dele
      </a>
      .
    </p>

    <h2>Hospedagem</h2>
    <p>
      Como em qualquer site, o provedor de hospedagem pode registrar dados técnicos de acesso,
      como endereço IP, data e hora e tipo de navegador, para segurança e funcionamento do
      serviço. O Milheirador não usa esses registros para identificar visitantes.
    </p>

    <h2>Seus direitos</h2>
    <p>
      Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir informações sobre o tratamento
      dos seus dados, além de correção ou exclusão. Como não guardamos dados pessoais, na maioria
      dos casos não há nada armazenado sobre você. Para dúvidas ou pedidos, escreva para{" "}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>

    <h2>Alterações</h2>
    <p>
      Esta política pode ser atualizada quando o site mudar. A data da última atualização fica no
      topo da página.
    </p>
  </Article>
);

export default Privacy;
