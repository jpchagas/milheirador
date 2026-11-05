import React, { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  brandLabel,
  cardName,
  formatAccumulation,
  formatBRL,
  formatFeeEfficiency,
  formatIndex,
  formatMiles,
  formatMilesPerReal,
  programLabel,
} from "@/utils/format";
import { DEFAULT_CRITERION, hasValidScore } from "@/utils/rankMyCard";

const UNAVAILABLE = "Indisponível";

// The three indicators (utils/rankMyCard.js), keyed by the ranking criterion that sorts by each.
const indicators = [
  {
    criterion: "index",
    header: "Índice Milheirador",
    value: card => (hasValidScore(card) ? formatIndex(card.milheiradorIndex) : UNAVAILABLE),
  },
  {
    criterion: "milesPerReal",
    header: "Milhas por R$",
    value: card => (hasValidScore(card) ? formatMilesPerReal(card.milesPerReal) : UNAVAILABLE),
  },
  {
    criterion: "feeEfficiency",
    header: "Milhas extras por R$ de anuidade",
    value: card =>
      !hasValidScore(card)
        ? UNAVAILABLE
        : card.annuity === 0
          ? "Não se aplica"
          : card.additionalMilesPerFeeReal === null
            ? UNAVAILABLE
            : formatFeeEfficiency(card.additionalMilesPerFeeReal),
  },
];

// Shared column layout for the header and each row (md and up).
const columns = "md:grid md:grid-cols-[2.5rem_1fr_6.5rem_6.5rem_8rem] md:items-center md:gap-4";

// `rows` are `{ card, position }`, where position is the card's place in the full ranking.
// With `showGaps`, a "…" row marks positions skipped between two rows. `criterion` is the
// one the rows are sorted by: its indicator is in bold, and the one shown on small screens.
const RankingTable = ({ rows, highlightId, showGaps = false, criterion = DEFAULT_CRITERION }) => {
  const active = indicators.find(i => i.criterion === criterion);
  const others = indicators.filter(i => i !== active);
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className={cn("hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground", columns)}>
        <span>#</span>
        <span>Cartão</span>
        {indicators.map(i => (
          <span key={i.criterion} className={cn("text-right", i === active && "text-foreground")}>{i.header}</span>
        ))}
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
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatMiles(card.annualMiles)} milhas/ano · anuidade {formatBRL(card.annuity)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground md:hidden">
                    {others.map(o => `${o.header}: ${o.value(card)}`).join(" · ")}
                  </div>
                </div>
                {/* Small screens: only the sorting indicator, with its name. */}
                <div className="text-right md:hidden">
                  <div className="font-semibold tabular-nums">{active.value(card)}</div>
                  <div className="text-xs text-muted-foreground">{active.header}</div>
                </div>
                {indicators.map(ind => (
                  <div
                    key={ind.criterion}
                    className={cn(
                      "hidden text-right tabular-nums md:block",
                      ind === active ? "font-semibold" : "text-sm"
                    )}
                  >
                    {ind.value(card)}
                  </div>
                ))}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
};

export default RankingTable;
