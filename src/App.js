import React, { useState } from 'react';
import './App.css';

const questions = [
  "Is your character real?",
  "Is your character from a TV show?",
  "Is your character animated?",
  "Is your character known for magic?",
  "Is your character a villain?"
];

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
  };

  return (
    <div className="app">
      <h1>🧙‍♂️ Welcome to Netnapz!</h1>
      {step < questions.length ? (
        <div className="question-card">
          <p>{questions[step]}</p>
          <button onClick={() => handleAnswer('Yes')}>Yes</button>
          <button onClick={() => handleAnswer('No')}>No</button>
        </div>
      ) : (
        <div className="result-card">
          <h2>I’m guessing... a mysterious character! 🤔</h2>
          <p>(This is just a demo – you can customize it!)</p>
          <button onClick={restart}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
