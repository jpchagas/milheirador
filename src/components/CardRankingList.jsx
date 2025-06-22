import React, { useState } from "react";
import { Card, ListGroup, Row, Col, Button} from "react-bootstrap";

const cardsPerPage = 8;

const CardRankingList = ({ rankedCards }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rankedCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = rankedCards.slice(startIndex, startIndex + cardsPerPage);

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div>
      <h3 className="mb-4">Top Credit Cards</h3>
      <Row className="g-4">
        {currentCards.map((card, index) => (
          <Col key={card.id} xs={12} sm={6} md={3}>
            <Card
              className="h-100 card-hover shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => window.open(card.link, "_blank")}
            >
              <Card.Body>
                <Card.Title>{card.brand} {card.type}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  #{startIndex + index + 1}
                </Card.Subtitle>
                <Card.Text>
                  Bandeira: {card.issuer}<br />
                  Acúmulo: {card.accumulationFactor} pts (BR)<br />
                  Int.: {card.accumulationFactorAbroad} pts<br />
                  Conversão: {card.conversionRatio} pts/milha<br />
                  Anuidade: R$ {card.annuity}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button
          variant="outline-primary"
          onClick={goToPrevious}
          disabled={currentPage === 1}
        >
          ← Anterior
        </Button>
        <span>Página {currentPage} de {totalPages}</span>
        <Button
          variant="outline-primary"
          onClick={goToNext}
          disabled={currentPage === totalPages}
        >
          Próxima →
        </Button>
      </div>
    </div>
  );
};

export default CardRankingList;
