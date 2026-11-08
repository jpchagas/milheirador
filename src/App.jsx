import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { creditCards } from "@/data/cards";
import { rankCards } from "@/utils/rankMyCard";
import { formatBRL } from "@/utils/format";
import {
  HOME_PATH,
  PURCHASE_PATH,
  RANKING_PATH,
  RESULT_PATH,
  cardFromProfile,
  profileFromSearch,
  profileHref,
  settingsFromProfile,
  withDollarRate,
} from "@/utils/profile";
import { cachedDollarRate, fetchDollarRate } from "@/utils/dollarRate";
import UserProfileForm from "@/components/UserProfileForm";
import TopRanking from "@/components/TopRanking";
import CardRankingList from "@/components/CardRankingList";
import HomeGuide from "@/components/HomeGuide";
import GoogleAds from "@/components/GoogleAds";
import ThemeToggle from "@/components/ThemeToggle";
import HowWeCalculate from "@/pages/HowWeCalculate";
import Programs from "@/pages/Programs";
import Faq from "@/pages/Faq";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Contact from "@/pages/Contact";
import WhereToBuy from "@/pages/WhereToBuy";

// Text pages, by path (their <head> data is in routes.js).
const textPages = {
  "/como-calculamos": HowWeCalculate,
  "/programas": Programs,
  "/perguntas-frequentes": Faq,
  "/sobre": About,
  "/privacidade": Privacy,
  "/contato": Contact,
};

const headerLinks = [
  { href: RANKING_PATH, label: "Ranking" },
  { href: PURCHASE_PATH, label: "Onde comprar" },
  { href: "/como-calculamos", label: "Como calculamos" },
  { href: "/programas", label: "Programas" },
];

const footerLinks = [
  ...headerLinks,
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/sobre", label: "Sobre" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/contato", label: "Contato" },
];

// The user's card takes the place of its dataset entry (it may carry the annuity the user
// pays); a manually entered card joins the ranking so the user can see where it lands.
const rankWith = (card, settings) => {
  if (!card) return rankCards(creditCards, settings);
  const listed = creditCards.some(c => c.id === card.id);
  const cards = listed ? creditCards.map(c => (c.id === card.id ? card : c)) : [...creditCards, card];
  return rankCards(cards, settings);
};

// Every navigation is a full page load, so `path` and `search` come from the URL once
// (main.jsx in the browser, scripts/prerender.js at build time).
function App({ path: rawPath, search }) {
  const path = rawPath.replace(/(.)\/+$/, "$1");
  const TextPage = textPages[path];
  const view = TextPage
    ? "text"
    : path === RANKING_PATH
      ? "ranking"
      : path === PURCHASE_PATH
        ? "purchase"
        : "home";

  // Today's dollar rate; the cached one (none while prerendering) until the fetch below.
  const [ptax, setPtax] = useState(cachedDollarRate);
  const [profile, setProfile] = useState(() => withDollarRate(profileFromSearch(search), cachedDollarRate()));
  // /resultado shows the result for the profile in the URL until the form is edited.
  const [showResult, setShowResult] = useState(path === RESULT_PATH);
  const resultsRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const settings = settingsFromProfile(profile);
  const card = cardFromProfile(profile, creditCards);
  const ranking = rankWith(card, settings);
  const resultCard = showResult && card && ranking.find(c => c.id === card.id);

  // Any edit makes the result stale: hide it and keep the URL in step with the form.
  const handleProfileChange = next => {
    setProfile(next);
    setShowResult(false);
    window.history.replaceState(null, "", profileHref(view === "purchase" ? PURCHASE_PATH : HOME_PATH, next));
  };

  // Links to the pages that use the card keep it once one is picked (the prerendered pages,
  // with no card, link to the plain paths).
  const hasCard = profile.manual || profile.cardId;
  const navHref = href =>
    hasCard && (href === RANKING_PATH || href === PURCHASE_PATH) ? profileHref(href, profile) : href;

  // An automatic dollar rate follows the PTAX; one the user set stays.
  useEffect(() => {
    fetchDollarRate().then(result => {
      if (!result) return;
      setPtax(result);
      setProfile(current => withDollarRate(current, result));
    });
  }, []);

  useEffect(() => {
    if (resultCard) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Only when the result page first loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <a href={HOME_PATH} className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-10 w-auto" />
            <span className="font-heading text-2xl font-extrabold tracking-tight text-primary">
              Milheirador
            </span>
          </a>
          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-1 md:flex">
              {headerLinks.map(({ href, label }) => (
                <Button key={href} asChild variant="ghost" size="sm">
                  <a href={navHref(href)} aria-current={path === href ? "page" : undefined}>{label}</a>
                </Button>
              ))}
            </nav>
            <ThemeToggle />
            {/* Below md the header links don't fit, so they open from a menu button. */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(open => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-menu" className="border-t px-4 py-2 md:hidden">
            {headerLinks.map(({ href, label }) => (
              <a
                key={href}
                href={navHref(href)}
                aria-current={path === href ? "page" : undefined}
                className="flex min-h-11 items-center rounded-lg px-2 font-medium hover:bg-muted aria-[current=page]:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {view === "text" ? (
          <TextPage />
        ) : view === "purchase" ? (
          <WhereToBuy cards={creditCards} profile={profile} card={card} ptax={ptax} onProfileChange={handleProfileChange} />
        ) : view === "ranking" ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <Button asChild variant="ghost" size="sm" className="-ml-2.5">
                <a href={profileHref(HOME_PATH, profile)}>
                  <ArrowLeft /> Voltar
                </a>
              </Button>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight">Ranking completo</h1>
              <p className="text-muted-foreground">
                Todos os cartões para um gasto de {formatBRL(settings.monthlySpend)} por mês e dólar
                a {formatBRL(settings.dollarRate)}. Para usar o seu gasto,{" "}
                <a href={profileHref(HOME_PATH, profile)} className="font-medium text-primary underline underline-offset-4">
                  preencha o simulador
                </a>
                . Entenda a ordem em{" "}
                <a href="/como-calculamos" className="font-medium text-primary underline underline-offset-4">
                  como calculamos
                </a>
                .
              </p>
            </div>
            <CardRankingList rankedCards={ranking} highlightId={card?.id} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            <section className="mx-auto max-w-2xl text-center">
              <span className="mb-4 inline-flex rounded-full bg-highlight px-3 py-1 text-sm font-medium text-highlight-foreground">
                Livelo, Smiles e programas dos bancos
              </span>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Qual cartão gera mais milhas para o seu gasto?
              </h1>
              <p className="mt-3 text-lg text-muted-foreground text-pretty">
                Informe quanto você gasta por mês e descubra quais cartões geram mais milhas com o
                menor desembolso para o seu perfil, em todos os programas de pontos.
              </p>
            </section>

            <div className="mx-auto max-w-xl">
              <UserProfileForm
                cards={creditCards}
                profile={profile}
                card={card}
                ptax={ptax}
                resultHref={profileHref(RESULT_PATH, profile)}
                rankingHref={profileHref(RANKING_PATH, profile)}
                onChange={handleProfileChange}
              />
            </div>

            {resultCard && (
              <section ref={resultsRef} className="scroll-mt-20">
                <TopRanking rankedCards={ranking} current={resultCard} settings={settings} />
              </section>
            )}

            <HomeGuide />
            {/* The only ad on this page, after the explanatory text and not next to the form. */}
            <GoogleAds slot="content" />
          </div>
        )}
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 text-sm text-muted-foreground">
          <nav className="flex flex-wrap gap-x-4 gap-y-2 max-sm:gap-y-0">
            {footerLinks.map(({ href, label }) => (
              <a key={href} href={navHref(href)} className="touch-target hover:text-foreground hover:underline">{label}</a>
            ))}
          </nav>
          <p>
            Valores informativos, baseados nas condições divulgadas pelos emissores. Confirme
            acúmulo, anuidade e regras de transferência com o seu banco antes de decidir.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
