import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Alert } from "react-bootstrap";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { creditCards } from "./data/cards";
import { calculateScore, getCardRanking } from "./utils/rankMyCard";
import CardRankingList from "./components/CardRankingList";
import CardInputForm from "./components/CardInputForm";
import GoogleAds from "./components/GoogleAds";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [rankedCards, setRankedCards] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [showModal, setShowModal] = useState(false);

    useEffect(() => {
    // Pre-rank the existing cards on page load
    const preRanked = creditCards
      .map(card => ({ ...card, score: calculateScore(card) }))
      .sort((a, b) => b.score - a.score);
    setRankedCards(preRanked);
  }, []);

  const handleFormSubmit = userCard => {
    const {position } = getCardRanking(userCard, creditCards);
    setUserRank(position);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={2}><GoogleAds /></Col>

        <Col md="auto">
          <h1 className="text-center mb-4">Cartão Milheiro</h1>
          <CardInputForm onSubmit={handleFormSubmit} />
          <CardRankingList rankedCards={rankedCards} />
        </Col>

        <Col md={2}><GoogleAds /></Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Your Card Rank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            🎉 Your card ranks at position: <strong>#{userRank}</strong>
          </Alert>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default App
