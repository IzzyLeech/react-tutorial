import { useState } from "react"
import {languages} from "../languages"
import {clsx} from "clsx"
import { getFarewellText, getRandomWord } from "../utils"
import Confetti from "react-confetti"


export default function Main() {
    // State Values
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters]  = useState([])
    
    // Derived Values
    const numGuessesLeft = languages.length - 1
    const wrongGuessCount = 
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= numGuessesLeft
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    //Static Values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters => 
            prevLetters.includes(letter) ? prevLetters : [...prevLetters,letter]
        )
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
       const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
       }
       const className = clsx("chip", isLanguageLost && "lost")
        return ( 
        <span className={className} style={styles} key={lang.name}>{lang.name}</span>)
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevelLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx (
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
        <span key={index} className={letterClassName}>{shouldRevelLetter ? letter.toLocaleUpperCase() : ""}</span>
    )})

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong,

        })
        return(
        <button 
        className={className}
        key="letter"
        disabled={isGameOver}
        aria-label={`Letter ${letter}`}
        aria-disabled={guessedLetters.includes(letter)}
        onClick={() => addGuessedLetter(letter)}>
            {letter.toUpperCase()}</button>
    )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } 
        if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
        
        return null
    }

    return (
        <main>
            {
                isGameWon && <Confetti recycle={false} numberOfPieces={1000}/>
            }
            <header>
            <h1>Assembly: Endgame</h1>
            <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>            
        </header>
        <section aria-live="polite" role="status" className={gameStatusClass}>
            {renderGameStatus()}
        </section>
        <section className="language-chips">
        {languageElements}
        </section>
        <section className="word">
        {letterElements}
        </section>

        <section className="sr-only" aria-live="polite" role="status">

        <p>
            {currentWord.includes(lastGuessedLetter ) ? `Correct! The ${lastGuessedLetter} is in the word`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word`
            }

            You have {numGuessesLeft} attempts left!
        </p>

        <p>Current word: {currentWord.split("").map(letter => 
            guessedLetters.includes(letter) ? "letter" + "." : "blank" 
        ).join(" ")}</p>
        </section>

        <section className="keyboard">
            {keyboardElements}
        </section>
        {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
        </main>
    )
}