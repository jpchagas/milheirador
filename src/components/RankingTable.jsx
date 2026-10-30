import React, { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { brandLabel, cardName, formatAccumulation, formatBRL, formatMiles, programLabel } from "@/utils/format";

// Shared column layout for the header and each row (md and up).
const columns = "md:grid md:grid-cols-[2.5rem_1fr_7rem_7rem_7rem] md:items-center md:gap-4";

// `rows` are `{ card, position }`, where position is the card's place in the full ranking.
// With `showGaps`, a "…" row marks positions skipped between two rows.
const RankingTable = ({ rows, highlightId, showGaps = false }) => (
  <div className="overflow-hidden rounded-lg border">
    <div className={cn("hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground", columns)}>
      <span>#</span>
      <span>Cartão</span>
      <span className="text-right">Custo/milha</span>
      <span className="text-right">Milhas/ano</span>
      <span className="text-right">Anuidade</span>
    </div>
    <ol className="divide-y">
      {rows.map(({ card, position }, i) => {
        const isUserCard = card.id === highlightId;
        const hasGap = showGaps && i > 0 && position > rows[i - 1].position + 1;
        return (
          <Fragment key={card.id}>
            {hasGap && (
              <li aria-hidden className="px-4 py-1 text-center text-sm text-muted-foreground">…</li>
            )}
            <li className={cn("grid grid-cols-[1.75rem_1fr_auto] gap-x-3 px-4 py-3", columns, isUserCard && "bg-highlight/10")}>
              <span className="text-sm font-medium tabular-nums text-muted-foreground">{position}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 font-medium">
                  {cardName(card)}
                  {isUserCard && <Badge className="bg-highlight text-highlight-foreground">Seu cartão</Badge>}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  {brandLabel(card.brand)} · {formatAccumulation(card)}
                  {card.program && <Badge variant="secondary">{programLabel(card.program)}</Badge>}
                </div>
                <div className="mt-1 text-xs text-muted-foreground md:hidden">
                  {formatMiles(card.annualMiles)} milhas/ano · anuidade {formatBRL(card.annuity)}
                </div>
              </div>
              <div className="text-right font-semibold tabular-nums">{formatBRL(card.costPerMile)}</div>
              <div className="hidden text-right text-sm tabular-nums md:block">{formatMiles(card.annualMiles)}</div>
              <div className="hidden text-right text-sm tabular-nums md:block">{formatBRL(card.annuity)}</div>
            </li>
          </Fragment>
        );
      })}
    </ol>
  </div>
);

export default RankingTable;
