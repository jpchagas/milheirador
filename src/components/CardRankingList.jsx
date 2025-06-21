import React from "react";
import { Card, ListGroup, Row, Col } from "react-bootstrap";

const CardRankingList = ({ rankedCards }) => {
  return (
    <div>
      <h2 className="mb-4">Top Credit Cards</h2>
      <Row className="g-4">
        {rankedCards.map((card, index) => (
          <Col key={card.id} xs={12} sm={6} md={3}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{card.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Rank #{index + 1}</Card.Subtitle>
                <Card.Text>
                  Bandeira: {card.brand}<br />
                  Emissor: {card.issuer}<br />
                  Tipo: {card.type}<br />
                  Acúmulo: {card.accumulationFactor} pts (Brasil)<br />
                  Acúmulo Int.: {card.accumulationFactorAbroad} pts<br />
                  Conversão: {card.conversionRatio} pts/milha<br />
                  Moeda: {card.currency}<br />
                  Anuidade: R$ {card.annuity}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CardRankingList;
