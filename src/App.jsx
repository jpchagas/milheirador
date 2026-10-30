import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { creditCards } from "@/data/cards";
import { DEFAULT_DOLLAR_RATE, DEFAULT_MONTHLY_SPEND, rankCards } from "@/utils/rankMyCard";
import { formatBRL, parseNumber } from "@/utils/format";
import { emptyManualCard } from "@/utils/manualCard";
import UserProfileForm from "@/components/UserProfileForm";
import TopRanking from "@/components/TopRanking";
import CardRankingList from "@/components/CardRankingList";
import GoogleAds from "@/components/GoogleAds";
import ThemeToggle from "@/components/ThemeToggle";

const HOME_HREF = "#/";
const RANKING_HREF = "#/ranking";

// Two views, switched by the URL hash so the back button and links work without a router.
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash === RANKING_HREF ? "ranking" : "home";
}

const initialProfile = {
  monthlySpend: String(DEFAULT_MONTHLY_SPEND),
  dollarRate: DEFAULT_DOLLAR_RATE.toFixed(2).replace(".", ","),
  manual: false,
  issuer: "",
  cardId: "",
  manualCard: emptyManualCard,
};

// A manually entered card joins the ranking so the user can see where it lands.
const rankWith = (card, settings) =>
  rankCards(card && !creditCards.includes(card) ? [...creditCards, card] : creditCards, settings);

function App() {
  const route = useHashRoute();
  // The form lives here so it survives the trip to the ranking page.
  const [profile, setProfile] = useState(initialProfile);
  // Snapshot of the last calculation: the card and the settings it was ranked with.
  const [result, setResult] = useState(null);
  const resultsRef = useRef(null);

  const settings = {
    monthlySpend: parseNumber(profile.monthlySpend) || 0,
    dollarRate: parseNumber(profile.dollarRate) || DEFAULT_DOLLAR_RATE,
  };

  // Any edit makes the result stale, so it is hidden until the next calculation.
  const handleProfileChange = next => {
    setProfile(next);
    setResult(null);
  };
  const handleCalculate = card => setResult({ card, settings });

  useEffect(() => {
    if (result) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  const resultRanking = result && rankWith(result.card, result.settings);
  const resultCard = result && resultRanking.find(c => c.id === result.card.id);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <a href={HOME_HREF} className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-10 w-auto" />
            <span className="font-heading text-2xl font-extrabold tracking-tight text-primary">
              Milheirador
            </span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {route === "ranking" ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <Button asChild variant="ghost" size="sm" className="-ml-2.5">
                <a href={HOME_HREF}>
                  <ArrowLeft /> Voltar
                </a>
              </Button>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight">Ranking completo</h1>
              <p className="text-muted-foreground">
                Todos os cartões para um gasto de {formatBRL(settings.monthlySpend)} por mês e dólar
                a {formatBRL(settings.dollarRate)}.
              </p>
            </div>
            <CardRankingList
              rankedCards={rankWith(result?.card, settings)}
              highlightId={result?.card.id}
            />
            <GoogleAds />
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
                rankingHref={RANKING_HREF}
                onChange={handleProfileChange}
                onCalculate={handleCalculate}
              />
            </div>

            {resultCard && (
              <section ref={resultsRef} className="scroll-mt-20">
                <TopRanking rankedCards={resultRanking} current={resultCard} settings={result.settings} />
              </section>
            )}

            <GoogleAds />
          </div>
        )}
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
          Valores informativos, baseados nas condições divulgadas pelos emissores. Confirme
          acúmulo, anuidade e regras de transferência com o seu banco antes de decidir.
        </div>
      </footer>
    </div>
  )
}

export default App
