import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

function Dashboard() {
  const { userProfile, fetchUserProfile } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const levels = [
    { id: 1, title: 'Cores em Inglês', description: 'Aprenda as cores básicas (Red, Blue, Green...).' },
    { id: 2, title: 'Números em Inglês', description: 'Aprenda números de 1 a 10 em inglês.' },
    { id: 3, title: 'Animais em Inglês', description: 'Aprenda nomes de animais comuns em inglês.' },
    { id: 4, title: 'Itens da Escola', description: 'Aprenda objetos escolares em inglês.' },
    { id: 5, title: 'Partes do Corpo', description: 'Aprenda partes do corpo em inglês.' },
    { id: 6, title: 'Dias da Semana', description: 'Aprenda os dias da semana em inglês.' },
    { id: 7, title: 'Família', description: 'Aprenda membros da família em inglês.' },
    { id: 8, title: 'Verbo To Be', description: 'Complete frases simples com am/is/are.' },
    { id: 9, title: 'Pronomes Pessoais', description: 'Aprenda pronomes como I, You, He, She...' },
    { id: 10, title: 'Frases Simples', description: 'Traduza frases básicas do dia a dia.' },
  ];

  const isLevelUnlocked = (levelId) => {
    if (!userProfile) return levelId === 1;
    return levelId <= (userProfile.currentLevel || 1);
  };

  const isLevelCompleted = (levelId) => {
    if (!userProfile) return false;
    return userProfile.completedLevels.includes(levelId);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Níveis do Jogo</h1>
          <p>Complete os níveis em ordem para desbloquear os próximos desafios!</p>
        </div>
        <div className="levels-grid">
          {levels.map((level) => (
            <div 
              key={level.id} 
              className={`level-card ${isLevelCompleted(level.id) ? 'completed' : isLevelUnlocked(level.id) ? 'unlocked' : 'locked'}`}
            >
              <div className="level-number">{level.id}</div>
              <h3>{level.title}</h3>
              <p>{level.description}</p>
              {isLevelUnlocked(level.id) ? (
                <Link to={`/level/${level.id}`} className="level-button">
                  {isLevelCompleted(level.id) ? 'Jogar Novamente' : 'Jogar'}
                </Link>
              ) : (
                <div className="level-locked">
                  <span className="lock-icon">🔒</span>
                  <span>Bloqueado</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
