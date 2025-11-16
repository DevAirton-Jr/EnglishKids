import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/GameLevel.css';

function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const id = parseInt(lessonId);

  const data = {
    1: { type: 'translation', title: 'Cores em Inglês', list: [
      { pt: 'Vermelho', en: 'Red' }, { pt: 'Azul', en: 'Blue' }, { pt: 'Verde', en: 'Green' },
      { pt: 'Amarelo', en: 'Yellow' }, { pt: 'Preto', en: 'Black' }, { pt: 'Branco', en: 'White' },
      { pt: 'Rosa', en: 'Pink' }, { pt: 'Laranja', en: 'Orange' }, { pt: 'Roxo', en: 'Purple' }, { pt: 'Marrom', en: 'Brown' }
    ]},
    2: { type: 'translation', title: 'Números em Inglês', list: [
      { pt: 'Um', en: 'One' }, { pt: 'Dois', en: 'Two' }, { pt: 'Três', en: 'Three' }, { pt: 'Quatro', en: 'Four' },
      { pt: 'Cinco', en: 'Five' }, { pt: 'Seis', en: 'Six' }, { pt: 'Sete', en: 'Seven' }, { pt: 'Oito', en: 'Eight' },
      { pt: 'Nove', en: 'Nine' }, { pt: 'Dez', en: 'Ten' }
    ]},
    3: { type: 'translation', title: 'Animais em Inglês', list: [
      { pt: 'Cachorro', en: 'Dog' }, { pt: 'Gato', en: 'Cat' }, { pt: 'Pássaro', en: 'Bird' }, { pt: 'Peixe', en: 'Fish' },
      { pt: 'Cavalo', en: 'Horse' }, { pt: 'Vaca', en: 'Cow' }, { pt: 'Porco', en: 'Pig' }, { pt: 'Coelho', en: 'Rabbit' },
      { pt: 'Urso', en: 'Bear' }, { pt: 'Leão', en: 'Lion' }
    ]},
    4: { type: 'translation', title: 'Itens da Escola', list: [
      { pt: 'Lápis', en: 'Pencil' }, { pt: 'Caneta', en: 'Pen' }, { pt: 'Caderno', en: 'Notebook' }, { pt: 'Livro', en: 'Book' },
      { pt: 'Mochila', en: 'Backpack' }, { pt: 'Borracha', en: 'Eraser' }, { pt: 'Régua', en: 'Ruler' }, { pt: 'Quadro', en: 'Board' },
      { pt: 'Mesa', en: 'Table' }, { pt: 'Cadeira', en: 'Chair' }
    ]},
    5: { type: 'translation', title: 'Partes do Corpo', list: [
      { pt: 'Cabeça', en: 'Head' }, { pt: 'Mão', en: 'Hand' }, { pt: 'Pé', en: 'Foot' }, { pt: 'Braço', en: 'Arm' },
      { pt: 'Perna', en: 'Leg' }, { pt: 'Olho', en: 'Eye' }, { pt: 'Boca', en: 'Mouth' }, { pt: 'Nariz', en: 'Nose' },
      { pt: 'Orelha', en: 'Ear' }, { pt: 'Dente', en: 'Tooth' }
    ]},
    6: { type: 'translation', title: 'Dias da Semana', list: [
      { pt: 'Segunda-feira', en: 'Monday' }, { pt: 'Terça-feira', en: 'Tuesday' }, { pt: 'Quarta-feira', en: 'Wednesday' },
      { pt: 'Quinta-feira', en: 'Thursday' }, { pt: 'Sexta-feira', en: 'Friday' }, { pt: 'Sábado', en: 'Saturday' }, { pt: 'Domingo', en: 'Sunday' }
    ]},
    7: { type: 'translation', title: 'Família', list: [
      { pt: 'Mãe', en: 'Mother' }, { pt: 'Pai', en: 'Father' }, { pt: 'Irmão', en: 'Brother' }, { pt: 'Irmã', en: 'Sister' },
      { pt: 'Avó', en: 'Grandmother' }, { pt: 'Avô', en: 'Grandfather' }, { pt: 'Filho', en: 'Son' }, { pt: 'Filha', en: 'Daughter' },
      { pt: 'Tio', en: 'Uncle' }, { pt: 'Tia', en: 'Aunt' }
    ]},
    8: { type: 'sentence', title: 'Verbo To Be', list: [
      { q: 'I ___ happy', a: 'am' }, { q: 'You ___ my friend', a: 'are' }, { q: 'He ___ a boy', a: 'is' },
      { q: 'She ___ a girl', a: 'is' }, { q: 'We ___ students', a: 'are' }, { q: 'They ___ at home', a: 'are' }
    ], pool: ['am', 'is', 'are'] },
    9: { type: 'translation', title: 'Pronomes Pessoais', list: [
      { pt: 'Eu', en: 'I' }, { pt: 'Você', en: 'You' }, { pt: 'Ele', en: 'He' }, { pt: 'Ela', en: 'She' },
      { pt: 'Nós', en: 'We' }, { pt: 'Eles', en: 'They' }, { pt: 'Isso', en: 'It' }
    ]},
    10: { type: 'translation', title: 'Frases Simples', list: [
      { pt: 'Bom dia', en: 'Good morning' }, { pt: 'Obrigado', en: 'Thank you' }, { pt: 'Por favor', en: 'Please' }, { pt: 'Desculpa', en: 'Sorry' },
      { pt: 'Eu gosto de jogar', en: 'I like to play' }, { pt: 'Eu tenho um gato', en: 'I have a cat' }, { pt: 'Boa noite', en: 'Good night' }, { pt: 'Até logo', en: 'See you later' }
    ]}
  };

  const lesson = data[id];
  if (!lesson) return <div>Carregando...</div>;

  return (
    <div className="game-level">
      <div className="game-container">
        <div className="game-controls">
          <button className="control-button" onClick={() => navigate('/lessons')}>Voltar às Lições</button>
        </div>
        <h2 className="level-title">Lição {id} - {lesson.title}</h2>
        <div className="question-card">
          {lesson.type === 'translation' && (
            <div>
              <p className="question-text">Estude os pares de palavras em português e inglês:</p>
              <div className="options">
                {lesson.list.map((item, idx) => (
                  <div key={idx} className="option-button" style={{cursor:'default'}}>
                    {item.pt} → {item.en}
                  </div>
                ))}
              </div>
            </div>
          )}
          {lesson.type === 'sentence' && (
            <div>
              <p className="question-text">Estude como completar frases com am, is, are:</p>
              <div className="options">
                {lesson.list.map((item, idx) => (
                  <div key={idx} className="option-button" style={{cursor:'default'}}>
                    {item.q.replace('___', item.a)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lesson;