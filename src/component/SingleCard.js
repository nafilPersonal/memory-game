import React from 'react'
import '../component/singleCard.css'

function SingleCard({card, handleChoice, flipped , disabled, setIsFlipped}) {

    const handleClick = () => {
        if(!disabled){
            handleChoice(card)
        }
    }
    return (
        <div className='card'>

            <div className={flipped?"flipped":""}>
                <img className='front' src={card.src} alt="Card Front" />
                <img className='back' src="/img/cover.png" alt="Cover back" onClick={handleClick}/>
            </div>
        </div>
    )
}

export default SingleCard