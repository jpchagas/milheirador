import React, { useState } from "react";
import { creditCards } from "@/data/cards";
import {
  DEFAULT_DOLLAR_RATE,
  DEFAULT_MONTHLY_SPEND,
  rankCards,
  findUpgrades,
} from "@/utils/rankMyCard";
import { parseNumber } from "@/utils/format";
import UserProfileForm from "@/components/UserProfileForm";
import UpgradeSuggestions from "@/components/UpgradeSuggestions";
import CardRankingList from "@/components/CardRankingList";
import GoogleAds from "@/components/GoogleAds";
import ThemeToggle from "@/components/ThemeToggle";

function App() {
  const [monthlySpend, setMonthlySpend] = useState(String(DEFAULT_MONTHLY_SPEND));
  const [dollarRate, setDollarRate] = useState(DEFAULT_DOLLAR_RATE.toFixed(2).replace(".", ","));
  const [userCard, setUserCard] = useState(null);

  const settings = {
    monthlySpend: parseNumber(monthlySpend) || 0,
    dollarRate: parseNumber(dollarRate) || DEFAULT_DOLLAR_RATE,
  };
  // A manually entered card joins the ranking so the user can see where it lands.
  const isManualCard = userCard && !creditCards.includes(userCard);
  const rankedCards = rankCards(isManualCard ? [...creditCards, userCard] : creditCards, settings);
  const current = userCard && rankedCards.find(c => c.id === userCard.id);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-10 w-auto" />
            <span className="font-heading text-2xl font-extrabold tracking-tight text-primary">
              Milheirador
            </span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <section className="mb-8 max-w-2xl">
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

        <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-6 lg:sticky lg:top-20">
            <UserProfileForm
              cards={creditCards}
              monthlySpend={monthlySpend}
              dollarRate={dollarRate}
              userCard={userCard}
              onMonthlySpendChange={setMonthlySpend}
              onDollarRateChange={setDollarRate}
              onCardChange={setUserCard}
            />
            <div className="hidden lg:block"><GoogleAds /></div>
          </aside>

          <div className="min-w-0 space-y-6">
            {current && (
              <UpgradeSuggestions
                current={current}
                position={rankedCards.indexOf(current) + 1}
                total={rankedCards.length}
                upgrades={findUpgrades(rankedCards, current)}
              />
            )}
            <CardRankingList rankedCards={rankedCards} highlightId={current?.id} />
            <GoogleAds />
          </div>
        </div>
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
