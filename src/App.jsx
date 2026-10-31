import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { creditCards } from "@/data/cards";
import { rankCards } from "@/utils/rankMyCard";
import { formatBRL } from "@/utils/format";
import {
  HOME_PATH,
  RANKING_PATH,
  RESULT_PATH,
  cardFromProfile,
  profileFromSearch,
  profileHref,
  settingsFromProfile,
} from "@/utils/profile";
import UserProfileForm from "@/components/UserProfileForm";
import TopRanking from "@/components/TopRanking";
import CardRankingList from "@/components/CardRankingList";
import GoogleAds from "@/components/GoogleAds";
import ThemeToggle from "@/components/ThemeToggle";

// Every navigation is a full page load, so the path is read once.
const path = window.location.pathname.replace(/(.)\/+$/, "$1");
const view = path === RANKING_PATH ? "ranking" : "home";

// A manually entered card joins the ranking so the user can see where it lands.
const rankWith = (card, settings) =>
  rankCards(card && !creditCards.includes(card) ? [...creditCards, card] : creditCards, settings);

function App() {
  const [profile, setProfile] = useState(() => profileFromSearch(window.location.search));
  // /resultado shows the result for the profile in the URL until the form is edited.
  const [showResult, setShowResult] = useState(path === RESULT_PATH);
  const resultsRef = useRef(null);

  const settings = settingsFromProfile(profile);
  const card = cardFromProfile(profile, creditCards);
  const ranking = rankWith(card, settings);
  const resultCard = showResult && card && ranking.find(c => c.id === card.id);

  // Any edit makes the result stale: hide it and keep the URL in step with the form.
  const handleProfileChange = next => {
    setProfile(next);
    setShowResult(false);
    window.history.replaceState(null, "", profileHref(HOME_PATH, next));
  };

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
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {view === "ranking" ? (
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
                a {formatBRL(settings.dollarRate)}.
              </p>
            </div>
            <CardRankingList rankedCards={ranking} highlightId={card?.id} />
            <GoogleAds slot="content" />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            <section className="mx-auto max-w-2xl text-center">
              <span className="mb-4 inline-flex rounded-full bg-highlight px-3 py-1 text-sm font-medium text-highlight-foreground">
                Livelo, Esfera, LATAM Pass, Smiles e mais
              </span>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Quanto custa cada milha do seu cartão?
              </h1>
              <p className="mt-3 text-lg text-muted-foreground text-pretty">
                Informe quanto você gasta por mês e descubra quais cartões geram milhas mais
                baratas para o seu perfil, em todos os programas de pontos.
              </p>
            </section>

            <div className="mx-auto max-w-xl">
              <UserProfileForm
                cards={creditCards}
                profile={profile}
                card={card}
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

            <GoogleAds slot="content" />
          </div>
        )}
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
          Valores informativos, baseados nas condições divulgadas pelos emissores. Confirme
          acúmulo, anuidade e regras de transferência com o seu banco antes de decidir.
        </div>
      </footer>

      {/* Sticks to the bottom of the screen and takes its own space at the end of the page,
          so it never covers the footer. index.css hides it when AdSense has no ad. */}
      <div className="ad-banner sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl justify-center">
          <GoogleAds
            slot="banner"
            responsive={false}
            className="h-[50px] w-full max-w-[728px] sm:h-[90px]"
          />
        </div>
      </div>
    </div>
  )
}

export default App
