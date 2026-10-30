import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RankingTable from "@/components/RankingTable";
import { brandLabel, issuerLabel, programLabel, formatBRL } from "@/utils/format";

const cardsPerPage = 10;
const ALL = "all";
const emptyFilters = { issuer: ALL, brand: ALL, program: ALL, maxAnnuity: ALL };
const annuityLimits = ["0", "500", "1000", "2000"];

const uniqueValues = (cards, key, label) =>
  [...new Set(cards.map(c => c[key]).filter(Boolean))].sort((a, b) =>
    label(a).localeCompare(label(b))
  );

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
          <RankingTable
            rows={currentCards.map(card => ({ card, position: rankedCards.indexOf(card) + 1 }))}
            highlightId={highlightId}
          />
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
