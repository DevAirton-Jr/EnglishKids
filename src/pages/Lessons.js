import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

function Lessons() {
  const { fetchUserProfile } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const lessons = [
    { id: 1, title: 'Cores em Inglês', description: 'Estude as cores básicas (Red, Blue, Green...).' },
    { id: 2, title: 'Números em Inglês', description: 'Estude números de 1 a 10 em inglês.' },
    { id: 3, title: 'Animais em Inglês', description: 'Estude nomes de animais comuns em inglês.' },
    { id: 4, title: 'Itens da Escola', description: 'Estude objetos escolares em inglês.' },
    { id: 5, title: 'Partes do Corpo', description: 'Estude partes do corpo em inglês.' },
    { id: 6, title: 'Dias da Semana', description: 'Estude os dias da semana em inglês.' },
    { id: 7, title: 'Família', description: 'Estude membros da família em inglês.' },
    { id: 8, title: 'Verbo To Be', description: 'Estude am, is, are em frases simples.' },
    { id: 9, title: 'Pronomes Pessoais', description: 'Estude pronomes como I, You, He, She...' },
    { id: 10, title: 'Frases Simples', description: 'Estude frases básicas do dia a dia.' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Lições de Inglês</h1>
          <p>Estude antes de jogar para melhorar seu desempenho!</p>
        </div>
        <div className="levels-grid">
          {lessons.map((lesson) => (
            <div key={lesson.id} className={`level-card unlocked`}>
              <div className="level-number">{lesson.id}</div>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <Link to={`/lesson/${lesson.id}`} className="level-button">
                Abrir Lição
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Lessons;