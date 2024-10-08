import { useEffect, useState } from 'react';
import './App.css';
import SingleCard from '../src/component/SingleCard';
import Swal from 'sweetalert2';
import { Heart } from 'lucide-react';

const cardImages = [
  { "src": "/img/Beetroot.jpg", matched: false },
  { "src": "/img/Brinjal.jpg", matched: false },
  { "src": "/img/Capsicum.jpg", matched: false },
  { "src": "/img/Onion.jpg", matched: false },
  { "src": "/img/Carrot.jpg", matched: false },
  { "src": "/img/Potato.jpg", matched: false },
  { "src": "/img/Tomato.jpg", matched: false },
  { "src": "/img/Callyflower.jpg", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [allFlipCard, setAllFlipCard] = useState(false);
  const [test, setTest] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const maxTurns = 5;
  const [mistakes, setMistakes] = useState(0);
  const [showStartMessage, setShowStartMessage] = useState(true);

  const handleChoice = (card) => {
    if (!disabled) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  const message = () => {
    Swal.fire({
      title: `Your turns: ${turns}`,
      text: `Best score: ${bestScore}`,
      imageUrl: '/img/completedTask.png',
      imageWidth: 400,
      imageHeight: 200,
      confirmButtonText: 'New Game',
      confirmButtonColor: '#2B7A78',
      showCancelButton: true,
      cancelButtonText: 'Resume',
      cancelButtonColor: '#17252A',
    }).then((result) => {
      if (result.isConfirmed) {
        shuffleCards();
      }
    });
  };

  const messageToQuit = () => {
    Swal.fire({
      imageUrl: '/img/notCompleted.png',
      imageWidth: 400,
      imageHeight: 200,
      confirmButtonText: 'Reset',
      confirmButtonColor: '#2B7A78',
      showCancelButton: true,
      cancelButtonText: 'Resume',
      cancelButtonColor: '#17252A',
    }).then((result) => {
      if (result.isConfirmed) {
        shuffleCards();
      }
    });
  };

  const checkResult = () => {
    const allMatched = cards.every(card => card.matched);
    setTest(allMatched);
    return allMatched;
  };

  const checkBest = () => {
    if (test) {
      message();
    } else {
      messageToQuit();
    }
  };

  useEffect(() => {
    if (test) {
      if (bestScore === 0 || turns < bestScore) {
        setBestScore(turns);
      }
    }
  }, [test, turns, bestScore]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (mistakes < maxTurns) {
        if (choiceOne.src === choiceTwo.src) {
          setCards(prevCards => {
            return prevCards.map(card => {
              if (card.src === choiceOne.src) {
                return { ...card, matched: true };
              } else {
                return card;
              }
            });
          });
          resetTurn();
        } else {
          setMistakes(prevMistakes => prevMistakes + 1);
          setTimeout(() => resetTurn(), 1000);
        }

        const isWin = checkResult();
        console.log(isWin);
        if (isWin) {
          Swal.fire({
            title: 'Congratulations!',
            text: 'You have matched all pairs successfully!',
            icon: 'success',
            confirmButtonText: 'Play Again',
            confirmButtonColor: '#2B7A78',
          }).then(() => {
            shuffleCards();
          });
        }
      } else {
        Swal.fire({
          title: 'Game Over!',
          text: `You've reached the maximum turns (${maxTurns}).`,
          icon: 'warning',
          confirmButtonText: 'New Game',
          confirmButtonColor: '#2B7A78',
        }).then(() => {
          shuffleCards();
        });
      }
    }
  }, [choiceOne, choiceTwo]);

  const shuffleCards = () => {
    setShowStartMessage(false);
    setAllFlipCard(true);
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    
    setCards(shuffledCards);
    setTurns(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTest(false);
    setMistakes(0);

    setTimeout(() => {
      setAllFlipCard(false);
    }, 5700);
  };

  useEffect(() => {
    if (showStartMessage) {
      Swal.fire({
        title: 'Welcome to Magic Match!',
        text: 'Match all the pairs before running out of turns',
        imageUrl: 'https://media.istockphoto.com/id/1358066166/vector/entertainment-and-hobbies-related-objects-and-elements-hand-drawn-vector-doodle-illustration.jpg?s=612x612&w=0&k=20&c=iEbuqCQLAXX4aJTYacSnM6z8V2ywwgbK1nJ_OSChY3A=',
        imageWidth: 400,
        imageHeight: 200,
        confirmButtonText: "Let's Play!",
        confirmButtonColor: '#2B7A78',
      }).then(() => {
        shuffleCards();
      });
    } else {
      shuffleCards();
    }
  }, []);

  const HeartsDisplay = ({ total, remaining }) => {
    return (
      <div className="hearts-container">
        {[...Array(total)].map((_, index) => (
          <Heart
            key={index}
            className={`heart ${index < remaining ? 'active heart-beat' : 'inactive'}`}
            size={24}
            color={index < remaining ? "#ff0000" : "#808080"}
            fill={index < remaining ? "#ff0000" : "#808080"}
            strokeWidth={1.5}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="App container">
      <h1 id='head' className='mt-5 mb-5'>Magic Match</h1>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}> 
        <button onClick={shuffleCards}>New Game</button>
        <button onClick={checkBest}>Check Result</button>
      </div>
      
      <div className='card-grid'>
        {cards.map(card => (
          <SingleCard 
            key={card.id} 
            card={card} 
            handleChoice={handleChoice} 
            flipped={card === choiceOne || card === choiceTwo || card.matched || allFlipCard} 
            disabled={disabled} 
          />
        ))}
      </div>

      <HeartsDisplay 
        total={maxTurns} 
        remaining={maxTurns - mistakes}
      />
    </div>
  );
}

export default App;
