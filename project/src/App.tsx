import { useState, useEffect } from 'react';
import { questions, characters } from './data';
import type { Answer, Character, Hint } from './types';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [gameOver, setGameOver] = useState(false);
  const [guessedCharacter, setGuessedCharacter] = useState<Character | null>(null);
  const [thinking, setThinking] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [hints, setHints] = useState<Hint[]>([]);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAnswer = async (answer: Answer) => {
    setThinking(true);
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    // Magical thinking animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setThinking(false);

    if (currentQuestion + 1 >= questions.length) {
      const { character, score } = makeGuess(newAnswers);
      setGuessedCharacter(character);
      setConfidence(Math.round(score * 100));
      generateHints(character);
      setGameOver(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const makeGuess = (userAnswers: Record<number, Answer>): { character: Character, score: number } => {
    let bestMatch = characters[0];
    let highestScore = -1;

    characters.forEach(character => {
      let score = 0;
      let totalQuestions = 0;
      
      Object.entries(userAnswers).forEach(([questionId, answer]) => {
        if (answer !== 'unsure') {
          totalQuestions++;
          const characterAnswer = character.attributes[Number(questionId)];
          if (answer === 'yes' && characterAnswer) score++;
          if (answer === 'no' && !characterAnswer) score++;
        }
      });

      const normalizedScore = totalQuestions > 0 ? score / totalQuestions : 0;
      
      if (normalizedScore > highestScore) {
        highestScore = normalizedScore;
        bestMatch = character;
      }
    });

    return { character: bestMatch, score: highestScore };
  };

  const generateHints = (character: Character) => {
    const newHints: Hint[] = [
      { text: `Category: ${character.category}`, revealed: false },
      { text: character.description, revealed: false }
    ];
    setHints(newHints);
  };

  const revealHint = (index: number) => {
    setHints(hints.map((hint, i) => 
      i === index ? { ...hint, revealed: true } : hint
    ));
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setGameOver(false);
    setGuessedCharacter(null);
    setThinking(false);
    setConfidence(0);
    setHints([]);
    setShowConfetti(false);
  };

  const handleCorrectGuess = () => {
    setStreak(prev => prev + 1);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleWrongGuess = () => {
    setStreak(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="crystal-ball max-w-lg w-full p-8 rounded-full">
        <div className="text-center mb-4">
          <span className="text-purple-300">🔥 Streak: {streak}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 magic-text">
          ✨ Netnapz ✨
        </h1>

        {thinking ? (
          <div className="text-center space-y-4">
            <div className="text-2xl text-white animate-pulse">
              🔮 Consulting the crystal ball... 🔮
            </div>
            <div className="text-purple-300 animate-bounce">
              ⭐ ⭐ ⭐
            </div>
          </div>
        ) : !gameOver ? (
          <div className="space-y-6">
            <div className="text-xl text-center mb-8 text-white">
              {questions[currentQuestion].text}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAnswer('yes')}
                className="wizard-button px-6 py-2 rounded-lg"
              >
                ✨ Yes ✨
              </button>
              <button
                onClick={() => handleAnswer('no')}
                className="wizard-button px-6 py-2 rounded-lg"
              >
                ❌ No ❌
              </button>
              <button
                onClick={() => handleAnswer('unsure')}
                className="wizard-button px-6 py-2 rounded-lg"
              >
                🤔 Unsure 🤔
              </button>
            </div>

            <div className="text-center text-sm text-purple-300">
              Spell {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold text-purple-300">
              The crystal ball reveals...
            </h2>
            <div className="confidence-meter mb-4">
              <div className="text-white text-sm mb-2">Confidence Level</div>
              <div className="bg-purple-900 rounded-full h-4 w-full">
                <div 
                  className="bg-purple-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <div className="text-purple-300 text-sm mt-1">{confidence}%</div>
            </div>
            <p className="text-3xl font-bold magic-text animate-pulse">
              {guessedCharacter?.name}
            </p>
            <div className="space-y-4 mt-4">
              {hints.map((hint, index) => (
                <div key={index} className="text-center">
                  {hint.revealed ? (
                    <p className="text-purple-300">{hint.text}</p>
                  ) : (
                    <button
                      onClick={() => revealHint(index)}
                      className="wizard-button px-4 py-1 text-sm rounded-lg"
                    >
                      🎭 Reveal Hint {index + 1} 🎭
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="space-x-4">
              <button
                onClick={handleCorrectGuess}
                className="wizard-button px-6 py-2 rounded-lg"
              >
                ✅ Correct! ✅
              </button>
              <button
                onClick={handleWrongGuess}
                className="wizard-button px-6 py-2 rounded-lg"
              >
                ❌ Wrong ❌
              </button>
            </div>
            <button
              onClick={resetGame}
              className="wizard-button px-6 py-2 rounded-lg mt-4"
            >
              🎯 Cast Another Spell 🎯
            </button>
          </div>
        )}
      </div>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {/* Add sparkle effects here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">✨</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;