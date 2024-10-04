import { useEffect, useState } from 'react'
import './App.css'
import SingleCard from './component/SingleCard'
import Swal from 'sweetalert2'

const cardImages = [
  { "src": "/img/Beetroot.jpg", matched: false },
  { "src": "/img/Brinjal.jpg", matched: false },
  { "src": "/img/Capsicum.jpg", matched: false },
  { "src": "/img/Onion.jpg", matched: false },
  { "src": "/img/Carrot.jpg", matched: false },
  { "src": "/img/Potato.jpg", matched: false },
  { "src": "/img/Tomato.jpg", matched: false },
  { "src": "/img/Callyflower.jpg", matched: false },
  // { "src": "/img/Rhombus.png", matched: false },
  // { "src": "/img/trapezoid.png", matched: false },
]

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [allFlipCard, setAllFlipCard] = useState(false)
  const [test, setTest] = useState(false)
  const [bestScore,setBestScore] = useState(0)

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  const message = () => {

    Swal.fire({
      title: `Your turns is ${turns}`,
      text: `Lowest turns is ${bestScore}`,
      imageUrl: '/img/completedTask.png',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Task Completed',
      confirmButtonText:'New Game',
      showCancelButton: true,
      cancelButtonText: `Resume`,
      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        shuffleCards()
      }
    })
  }

  const messagetoquit = () => {

    Swal.fire({
      imageUrl: '/img/notCompleted.png',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Task Completed',
      confirmButtonText:'Reset',
      showCancelButton: true,
      cancelButtonText: `Resume`,
      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        shuffleCards()
      }
    })
  }

  const Result = ()=>{
    for(let i=0;i<cards.length;i++){
      if(!cards[i].matched){
        setTest(false)
        break
      }else{
          setTest(true)
          // let repeat = j.find((item)=>item==i)
          
      }
    }
  }

  
  const checkBest = () => {
    if(test){  
      message()
    }else{
      messagetoquit()
    }
  }

  useEffect(()=>{
    if(test){  
      if(bestScore>turns){
        setBestScore(turns)
      }else if(bestScore===0){
        setBestScore(turns)
      }
    }
  },[test])

  const resetTurn = () => {
    setChoiceTwo(null)
    setChoiceOne(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      setTurns((num) => num++)
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
    Result()
  }, [choiceOne,choiceTwo])

  const shuffleCards = () => {
    setAllFlipCard(true)
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))
    setCards(shuffledCards)
    setTurns(0)
    setChoiceOne(null)
    setChoiceTwo(null)
    setTimeout(() => {
      setAllFlipCard(false)
    }, 5700)

  }
  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="App container">
      <h1 id='head' className='mt-5 mb-5'>Magic Match</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button onClick={shuffleCards}>New Game</button>
        <buttons onClick={checkBest}>Check your Result</buttons>
      </div>
      <div className='card-grid'>
        
        {cards.map(card => (
          <SingleCard key={card.id} card={card} handleChoice={handleChoice} flipped={card === choiceOne || card === choiceTwo || card.matched || allFlipCard} disabled={disabled}/>
        ))}
      </div>
      <p style={{ marginTop: "50px", fontSize: "calc(var(--index)/1.1)", color:"Yellow" }}>Turns: {turns}</p>
    </div>
  );
}

export default App