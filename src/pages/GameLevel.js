import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/GameLevel.css';

function GameLevel() {
  const { levelId } = useParams();
  const levelNum = parseInt(levelId);
  const { userProfile, completeLevel, logout } = useAuth();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);

  const playSound = (name) => {
    const audio = new Audio(`/sounds/${name}.wav`);
    audio.play();
  };

  const generateOptions = (correctAnswer, pool) => {
    const options = [correctAnswer];
    const candidates = pool.filter((p) => p !== correctAnswer);
    while (options.length < 4 && candidates.length) {
      const idx = Math.floor(Math.random() * candidates.length);
      const opt = candidates.splice(idx, 1)[0];
      if (!options.includes(opt)) options.push(opt);
    }
    while (options.length < 4) {
      options.push(correctAnswer);
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const generateQuestions = useCallback(() => {
    const englishData = {
      1: {
        type: 'translation',
        list: [
          { pt: 'Vermelho', en: 'Red' },
          { pt: 'Azul', en: 'Blue' },
          { pt: 'Verde', en: 'Green' },
          { pt: 'Amarelo', en: 'Yellow' },
          { pt: 'Preto', en: 'Black' },
          { pt: 'Branco', en: 'White' },
          { pt: 'Rosa', en: 'Pink' },
          { pt: 'Laranja', en: 'Orange' },
          { pt: 'Roxo', en: 'Purple' },
          { pt: 'Marrom', en: 'Brown' }
        ]
      },
      2: {
        type: 'translation',
        list: [
          { pt: 'Um', en: 'One' },
          { pt: 'Dois', en: 'Two' },
          { pt: 'Três', en: 'Three' },
          { pt: 'Quatro', en: 'Four' },
          { pt: 'Cinco', en: 'Five' },
          { pt: 'Seis', en: 'Six' },
          { pt: 'Sete', en: 'Seven' },
          { pt: 'Oito', en: 'Eight' },
          { pt: 'Nove', en: 'Nine' },
          { pt: 'Dez', en: 'Ten' }
        ]
      },
      3: {
        type: 'translation',
        list: [
          { pt: 'Cachorro', en: 'Dog' },
          { pt: 'Gato', en: 'Cat' },
          { pt: 'Pássaro', en: 'Bird' },
          { pt: 'Peixe', en: 'Fish' },
          { pt: 'Cavalo', en: 'Horse' },
          { pt: 'Vaca', en: 'Cow' },
          { pt: 'Porco', en: 'Pig' },
          { pt: 'Coelho', en: 'Rabbit' },
          { pt: 'Urso', en: 'Bear' },
          { pt: 'Leão', en: 'Lion' }
        ]
      },
      4: {
        type: 'translation',
        list: [
          { pt: 'Lápis', en: 'Pencil' },
          { pt: 'Caneta', en: 'Pen' },
          { pt: 'Caderno', en: 'Notebook' },
          { pt: 'Livro', en: 'Book' },
          { pt: 'Mochila', en: 'Backpack' },
          { pt: 'Borracha', en: 'Eraser' },
          { pt: 'Régua', en: 'Ruler' },
          { pt: 'Quadro', en: 'Board' },
          { pt: 'Mesa', en: 'Table' },
          { pt: 'Cadeira', en: 'Chair' }
        ]
      },
      5: {
        type: 'translation',
        list: [
          { pt: 'Cabeça', en: 'Head' },
          { pt: 'Mão', en: 'Hand' },
          { pt: 'Pé', en: 'Foot' },
          { pt: 'Braço', en: 'Arm' },
          { pt: 'Perna', en: 'Leg' },
          { pt: 'Olho', en: 'Eye' },
          { pt: 'Boca', en: 'Mouth' },
          { pt: 'Nariz', en: 'Nose' },
          { pt: 'Orelha', en: 'Ear' },
          { pt: 'Dente', en: 'Tooth' }
        ]
      },
      6: {
        type: 'translation',
        list: [
          { pt: 'Segunda-feira', en: 'Monday' },
          { pt: 'Terça-feira', en: 'Tuesday' },
          { pt: 'Quarta-feira', en: 'Wednesday' },
          { pt: 'Quinta-feira', en: 'Thursday' },
          { pt: 'Sexta-feira', en: 'Friday' },
          { pt: 'Sábado', en: 'Saturday' },
          { pt: 'Domingo', en: 'Sunday' }
        ]
      },
      7: {
        type: 'translation',
        list: [
          { pt: 'Mãe', en: 'Mother' },
          { pt: 'Pai', en: 'Father' },
          { pt: 'Irmão', en: 'Brother' },
          { pt: 'Irmã', en: 'Sister' },
          { pt: 'Avó', en: 'Grandmother' },
          { pt: 'Avô', en: 'Grandfather' },
          { pt: 'Filho', en: 'Son' },
          { pt: 'Filha', en: 'Daughter' },
          { pt: 'Tio', en: 'Uncle' },
          { pt: 'Tia', en: 'Aunt' }
        ]
      },
      8: {
        type: 'sentence',
        list: [
          { q: 'Complete: I ___ happy', a: 'am' },
          { q: 'Complete: You ___ my friend', a: 'are' },
          { q: 'Complete: He ___ a boy', a: 'is' },
          { q: 'Complete: She ___ a girl', a: 'is' },
          { q: 'Complete: We ___ students', a: 'are' },
          { q: 'Complete: They ___ at home', a: 'are' }
        ],
        pool: ['am', 'is', 'are']
      },
      9: {
        type: 'translation',
        list: [
          { pt: 'Eu', en: 'I' },
          { pt: 'Você', en: 'You' },
          { pt: 'Ele', en: 'He' },
          { pt: 'Ela', en: 'She' },
          { pt: 'Nós', en: 'We' },
          { pt: 'Eles', en: 'They' },
          { pt: 'Isso', en: 'It' }
        ]
      },
      10: {
        type: 'translation',
        list: [
          { pt: 'Bom dia', en: 'Good morning' },
          { pt: 'Obrigado', en: 'Thank you' },
          { pt: 'Por favor', en: 'Please' },
          { pt: 'Desculpa', en: 'Sorry' },
          { pt: 'Eu gosto de jogar', en: 'I like to play' },
          { pt: 'Eu tenho um gato', en: 'I have a cat' },
          { pt: 'Boa noite', en: 'Good night' },
          { pt: 'Até logo', en: 'See you later' }
        ]
      }
    };

    const data = englishData[levelNum];
    if (!data) return [];

    const questions = [];
    const count = Math.min(5, data.list.length);
    const used = new Set();
    while (questions.length < count) {
      const idx = Math.floor(Math.random() * data.list.length);
      if (used.has(idx)) continue;
      used.add(idx);
      if (data.type === 'translation') {
        const item = data.list[idx];
        const pool = data.list.map((x) => x.en);
        questions.push({
          text: `Como se diz "${item.pt}" em inglês?`,
          correctAnswer: item.en,
          options: generateOptions(item.en, pool)
        });
      } else if (data.type === 'sentence') {
        const item = data.list[idx];
        const pool = data.pool;
        questions.push({
          text: item.q,
          correctAnswer: item.a,
          options: generateOptions(item.a, pool)
        });
      }
    }
    return questions;
  }, [levelNum]);

  const handleNextQuestion = useCallback(() => {
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setGameOver(true);
      const passed = score >= Math.ceil(questions.length * 0.6);
      if (passed) {
        completeLevel(levelNum);
        playSound("win");
      }
    }
  }, [currentQuestion, questions.length, score, completeLevel, levelNum]);

  useEffect(() => {
    setQuestions(generateQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setGameOver(false);
    setSelectedAnswer(null);
  }, [levelNum, generateQuestions]);

  

  const checkAnswer = (selectedOption) => {
    playSound("click");
    setSelectedAnswer(selectedOption);
    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      playSound("correct");
      setScore(prev => prev + 1);
    } else {
      playSound("wrong");
    }
    setShowResult(true);
    setTimeout(handleNextQuestion, 1500);
  };

  

  const restartGame = () => {
    playSound("click");
    setQuestions(generateQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setGameOver(false);
    setSelectedAnswer(null);
  };

  const handleLogout = async () => {
    playSound("click");
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Falha ao fazer logout', error);
    }
  };

  useEffect(() => {
    if (userProfile && levelNum > userProfile.currentLevel) {
      navigate('/dashboard');
    }
  }, [userProfile, levelNum, navigate]);

  if (!questions.length) return <div>Carregando...</div>;

  const currentQ = questions[currentQuestion];

  return (
    <div className="game-level">
      <div className="game-container">
        <div className="game-controls">
          <button className="control-button" onClick={() => { playSound("click"); navigate('/dashboard'); }}>Voltar ao Menu</button>
          <button className="control-button" onClick={handleLogout}>Sair</button>
        </div>

        <h2 className="level-title">Nível {levelNum}</h2>

        

        {!gameOver ? (
          <div className="question-card">
            <p className="question-text">{currentQ.text}</p>
            <div className="options">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`option-button ${selectedAnswer === opt ? 'selected' : ''}`}
                  onClick={() => checkAnswer(opt)}
                  disabled={showResult}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showResult && (
              <div className="result">
                {selectedAnswer === currentQ.correctAnswer ? "✔️ Correto!" : `❌ Errado! Resposta certa: ${currentQ.correctAnswer}`}
              </div>
            )}
          </div>
        ) : (
          <div className="result-container">
            <h2>Fim do Nível!</h2>
            <p>Pontuação: {score} / {questions.length}</p>
            <button className="control-button" onClick={restartGame}>Jogar Novamente</button>
            <button className="control-button" onClick={() => { playSound("click"); navigate('/dashboard'); }}>Voltar ao Menu</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameLevel;
