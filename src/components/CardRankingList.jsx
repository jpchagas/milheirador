import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  cardName,
  brandLabel,
  issuerLabel,
  programLabel,
  formatBRL,
  formatMiles,
  formatAccumulation,
} from "@/utils/format";

const cardsPerPage = 10;
const ALL = "all";
const emptyFilters = { issuer: ALL, brand: ALL, program: ALL, maxAnnuity: ALL };
const annuityLimits = ["0", "500", "1000", "2000"];

const uniqueValues = (cards, key, label) =>
  [...new Set(cards.map(c => c[key]).filter(Boolean))].sort((a, b) =>
    label(a).localeCompare(label(b))
  );

// Shared column layout for the header and each row (md and up).
const columns = "md:grid md:grid-cols-[2.5rem_1fr_7rem_7rem_7rem] md:items-center md:gap-4";

const CardRankingList = ({ rankedCards, highlightId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(emptyFilters);

  const filteredCards = rankedCards.filter(
    card =>
      (filters.issuer === ALL || card.issuer === filters.issuer) &&
      (filters.brand === ALL || card.brand === filters.brand) &&
      (filters.program === ALL || card.program === filters.program) &&
      (filters.maxAnnuity === ALL || card.annuity <= Number(filters.maxAnnuity))
  );

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / cardsPerPage));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * cardsPerPage;
  const currentCards = filteredCards.slice(startIndex, startIndex + cardsPerPage);

  const handleFilterChange = name => value => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const filterSelect = (name, allLabel, values, label) => (
    <Select value={filters[name]} onValueChange={handleFilterChange(name)}>
      <SelectTrigger size="sm" className="w-full" aria-label={allLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {values.map(v => (
          <SelectItem key={v} value={v}>{label(v)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ranking por custo da milha</CardTitle>
        <CardDescription>
          Custo por milha = (gasto anual + anuidade) ÷ milhas acumuladas no ano, com base no
          seu gasto mensal e na cotação informada.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {filterSelect("issuer", "Todos os bancos", uniqueValues(rankedCards, "issuer", issuerLabel), issuerLabel)}
          {filterSelect("brand", "Todas as bandeiras", uniqueValues(rankedCards, "brand", brandLabel), brandLabel)}
          {filterSelect("program", "Todos os programas", uniqueValues(rankedCards, "program", programLabel), programLabel)}
          {filterSelect("maxAnnuity", "Qualquer anuidade", annuityLimits, v =>
            v === "0" ? "Sem anuidade" : `Até ${formatBRL(Number(v))}`
          )}
        </div>

        {currentCards.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum cartão encontrado com esses filtros.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <div className={cn("hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground", columns)}>
              <span>#</span>
              <span>Cartão</span>
              <span className="text-right">Custo/milha</span>
              <span className="text-right">Milhas/ano</span>
              <span className="text-right">Anuidade</span>
            </div>
            <ol className="divide-y">
              {currentCards.map(card => {
                const isUserCard = card.id === highlightId;
                return (
                  <li
                    key={card.id}
                    className={cn("grid grid-cols-[1.75rem_1fr_auto] gap-x-3 px-4 py-3", columns, isUserCard && "bg-highlight/10")}
                  >
                    <span className="text-sm font-medium tabular-nums text-muted-foreground">
                      {rankedCards.indexOf(card) + 1}
                    </span>
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
                );
              })}
            </ol>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(page - 1)} disabled={page === 1}>
              <ChevronLeft /> Anterior
            </Button>
            <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(page + 1)} disabled={page === totalPages}>
              Próxima <ChevronRight />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardRankingList;
