import React from "react";
import { PartyPopper, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { brandLabel, cardName, formatBRL, formatMiles, formatMilesDelta, programLabel } from "@/utils/format";

const Metric = ({ value, label }) => (
  <div className="rounded-lg bg-muted/60 px-3 py-3 text-center">
    <div className="text-xl font-semibold tabular-nums sm:text-2xl">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const UpgradeSuggestions = ({ current, position, total, upgrades }) => (
  <Card className="border-primary/40 ring-1 ring-primary/10">
    <CardHeader>
      <CardDescription>Seu cartão</CardDescription>
      <CardTitle className="text-xl">{cardName(current)}</CardTitle>
      <CardDescription>
        {brandLabel(current.brand)}
        {current.program && ` · ${programLabel(current.program)}`}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Metric value={formatBRL(current.costPerMile)} label="por milha" />
        <Metric value={formatMiles(current.annualMiles)} label="milhas por ano" />
        <Metric value={`#${position}`} label={`de ${total} cartões`} />
      </div>

      {upgrades.length === 0 ? (
        <Alert>
          <PartyPopper />
          <AlertTitle>Seu cartão já é o melhor do ranking</AlertTitle>
          <AlertDescription>
            Nenhum outro cartão gera milhas mais baratas para esse nível de gastos.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="size-4 text-primary" />
            Cartões que geram milhas mais baratas para você
          </h3>
          <ul className="divide-y rounded-lg border">
            {upgrades.map(card => (
              <li key={card.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    {cardName(card)}
                    {card.issuer === current.issuer && <Badge variant="outline">Mesmo banco</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className={card.annualMiles > current.annualMiles ? "font-medium text-success" : "font-medium"}>
                      {formatMilesDelta(card.annualMiles - current.annualMiles)} milhas/ano
                    </span>
                    {" · "}anuidade {formatBRL(card.annuity)}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-semibold tabular-nums">{formatBRL(card.costPerMile)}</div>
                  <div className="text-xs text-muted-foreground">por milha</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
);

export default UpgradeSuggestions;
