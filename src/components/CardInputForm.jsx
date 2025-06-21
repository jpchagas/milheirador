import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const CardInputForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    bandeira: '',
    emissor: '',
    tipo: '',
    accumulation_factor: '',
    accumulation_factor_abroad: '',
    conversion_ratio: '',
    currency: '',
    annuity: ''
  });

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const requiredFields = [
      'bandeira',
      'emissor',
      'tipo',
      'accumulation_factor',
      'accumulation_factor_abroad',
      'conversion_ratio',
      'currency',
      'annuity'
    ];

    const isValid = requiredFields.every(field => form[field] !== '');

    if (isValid) {
      onSubmit(form);
    } else {
      alert("Preencha todos os campos antes de enviar.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <h4>Informe os dados do seu cartão</h4>

    <Form.Group className="mb-3">
      <Form.Label>Bandeira</Form.Label>
      <Form.Select name="bandeira" value={form.bandeira} onChange={handleChange} required>
        <option value="">Selecione...</option>
        <option value="Visa">Visa</option>
        <option value="Mastercard">Mastercard</option>
        <option value="Elo">Elo</option>
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Emissor</Form.Label>
      <Form.Control type="text" name="emissor" value={form.emissor} onChange={handleChange} required />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Tipo</Form.Label>
      <Form.Select name="tipo" value={form.tipo} onChange={handleChange} required>
        <option value="">Selecione...</option>
        <option value="Gold">Gold</option>
        <option value="Platinum">Platinum</option>
        <option value="Black">Black</option>
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Acúmulo (Brasil)</Form.Label>
      <Form.Control type="number" name="accumulation_factor" value={form.accumulation_factor} onChange={handleChange} step="0.1" required />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Acúmulo (Exterior)</Form.Label>
      <Form.Control type="number" name="accumulation_factor_abroad" value={form.accumulation_factor_abroad} onChange={handleChange} step="0.1" required />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Razão de Conversão</Form.Label>
      <Form.Control type="number" name="conversion_ratio" value={form.conversion_ratio} onChange={handleChange} step="0.1" required />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Moeda</Form.Label>
      <Form.Select name="currency" value={form.currency} onChange={handleChange} required>
        <option value="">Selecione...</option>
        <option value="BRL">BRL</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Anuidade</Form.Label>
      <Form.Control type="number" name="annuity" value={form.annuity} onChange={handleChange} required />
    </Form.Group>

      <Button variant="primary" type="submit">
        Verificar cartão
      </Button>
    </Form>
  );
};

export default CardInputForm;
