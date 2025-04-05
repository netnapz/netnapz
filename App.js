import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

const characters = [
  {
    name: "Harry Potter",
    traits: {
      isHuman: true,
      isReal: false,
      hasPowers: true,
      fromMovie: true,
      isAnimal: false,
    },
  },
  {
    name: "Batman",
    traits: {
      isHuman: true,
      isReal: false,
      hasPowers: false,
      fromMovie: true,
      isAnimal: false,
    },
  },
  {
    name: "Pikachu",
    traits: {
      isHuman: false,
      isReal: false,
      hasPowers: true,
      fromMovie: true,
      isAnimal: true,
    },
  },
];

const questions = [
  { text: "Is it a human?", key: "isHuman" },
  { text: "Is it real?", key: "isReal" },
  { text: "Does it have powers?", key: "hasPowers" },
  { text: "Is it from a movie?", key: "fromMovie" },
  { text: "Is it an animal?", key: "isAnimal" },
];

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [guess, setGuess] = useState(null);
  const [showGuess, setShowGuess] = useState(false);

  const currentQuestion = questions[step];

  const handleAnswer = (answer) => {
    const updated = { ...answers, [currentQuestion.key]: answer };
    setAnswers(updated);
    const nextStep = step + 1;

    if (nextStep < questions.length) {
      setStep(nextStep);
    } else {
      const match = characters.find((char) => {
        return Object.entries(updated).every(
          ([key, value]) => char.traits[key] === value
        );
      });
      setGuess(match);
      setShowGuess(true);
    }
  };

  const resetGame = () => {
    setStep(0);
    setAnswers({});
    setGuess(null);
    setShowGuess(false);
  };

  return (
    <div className="App">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🧙‍♂️ Welcome to Netnapz
      </motion.h1>

      {!showGuess && (
        <div className="question-box">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentQuestion.text}
          </motion.h2>
          <div className="buttons">
            <button onClick={() => handleAnswer(true)}>Yes</button>
            <button onClick={() => handleAnswer(false)}>No</button>
            <button onClick={() => handleAnswer(null)}>Maybe</button>
          </div>
        </div>
      )}

      {showGuess && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {guess ? (
            <>
              <h2>🔮 You're thinking of...</h2>
              <p className="guess">{guess.name}!</p>
              <button onClick={resetGame}>Play Again</button>
            </>
          ) : (
            <>
              <h2>🤔 I couldn't guess it!</h2>
              <button onClick={resetGame}>Try Again</button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default App;