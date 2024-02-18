import { useState } from 'react'
import './App.css'

function App() {
  const [cards, setCards] = useState([
    {
      id: 1,
      bandeira: "visa",
      emissor: "bradesco", 
      tipo: "infitine"
  },
  {
      id:2,
      bandeira: "american express",
      emissor: "santander", 
      tipo: "platinum"
  }
  ]);


  return <div className="app">
      <h1> Lista de Cards</h1>
      <div className="card-list">
        {cards.map((card) => (
          <div className="card">
            <div className="content">
              <p>{card.bandeira}</p>
              <p className="category">{card.emissor}</p>
              <p>{card.tipo}</p>
            </div>
            <div> Completar</div> 
            <button>x</button>
          </div>
        ))}
      </div>
    </div>
  
}

export default App
