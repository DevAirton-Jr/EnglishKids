import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

function Teacher() {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [expandedClassId, setExpandedClassId] = useState(null);

  const storageKey = `demoClasses:${currentUser?.uid || 'demo'}`;

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    const data = raw ? JSON.parse(raw) : [];
    setClasses(data);
  }, [storageKey]);

  const saveClasses = (next) => {
    setClasses(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const addClass = () => {
    if (!newClassName.trim()) return;
    const next = [
      ...classes,
      { id: Date.now(), name: newClassName.trim(), students: [] }
    ];
    setNewClassName('');
    saveClasses(next);
  };

  const removeClass = (id) => {
    const next = classes.filter(c => c.id !== id);
    saveClasses(next);
  };

  const addStudent = (classId, student) => {
    const next = classes.map(c => {
      if (c.id === classId) {
        return { ...c, students: [...c.students, { id: Date.now(), ...student, progress: { completedLevels: 0, currentLevel: 1, finalGrade: 0, exercisesCompleted: 0, lessonsCompleted: 0 } }] };
      }
      return c;
    });
    saveClasses(next);
  };

  const updateStudentProgress = (classId, studentId, progress) => {
    const next = classes.map(c => {
      if (c.id === classId) {
        return { ...c, students: c.students.map(s => s.id === studentId ? { ...s, progress } : s) };
      }
      return c;
    });
    saveClasses(next);
  };

  const removeStudent = (classId, studentId) => {
    const next = classes.map(c => {
      if (c.id === classId) {
        return { ...c, students: c.students.filter(s => s.id !== studentId) };
      }
      return c;
    });
    saveClasses(next);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Gestão de Turmas</h1>
          <p>Crie turmas, adicione alunos e acompanhe o progresso.</p>
        </div>

        <div className="section-card" style={{ marginBottom: 20 }}>
          <div className="section-header">
            <h3>Nova Turma</h3>
          </div>
          <input
            type="text"
            className="input-field"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Nome da Turma"
          />
          <button className="level-button" style={{ marginTop: 12 }} onClick={addClass}>Criar Turma</button>
        </div>

        <div className="teacher-grid">
          {classes.map((cls) => (
            <div key={cls.id} className="section-card" style={{ textAlign: 'left' }}>
              <div className="level-number">{cls.name}</div>
              <div className="teacher-actions" style={{ marginBottom: 12 }}>
                <button className="level-button" onClick={() => setExpandedClassId(expandedClassId === cls.id ? null : cls.id)}>
                  {expandedClassId === cls.id ? 'Fechar' : 'Abrir'}
                </button>
                <button className="level-button" onClick={() => removeClass(cls.id)}>Excluir Turma</button>
              </div>
              {expandedClassId === cls.id && (
                <div>
                  <h3>Alunos</h3>
                  <StudentCreate onCreate={(student) => addStudent(cls.id, student)} />
                  <div style={{ marginTop: 15 }}>
                    {cls.students.length === 0 ? (
                      <p style={{ color: '#ccc' }}>Nenhum aluno cadastrado.</p>
                    ) : (
                      cls.students.map((s) => (
                        <div key={s.id} className="editor-card" style={{ marginBottom: 12 }}>
                          <div className="section-header">
                            <div>
                              <strong>{s.name}</strong> {s.email ? `- ${s.email}` : ''}
                            </div>
                            <div className="teacher-actions">
                              <button className="level-button" onClick={() => removeStudent(cls.id, s.id)}>Remover</button>
                            </div>
                          </div>
                          <div style={{ color: '#ccc', marginBottom: 10 }}>
                            Progresso no jogo: {s.progress.completedLevels * 10}% | Nível atual: {s.progress.currentLevel}
                          </div>
                          <ProgressEditor
                            progress={s.progress}
                            onChange={(p) => updateStudentProgress(cls.id, s.id, p)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentCreate({ onCreate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div className="section-card" style={{ marginTop: 12 }}>
      <h4>Novo Aluno</h4>
      <input
        type="text"
        className="input-field"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do aluno"
      />
      <input
        type="email"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email do aluno (opcional)"
        style={{ marginTop: 8 }}
      />
      <button className="level-button" style={{ marginTop: 12 }} onClick={() => { if (name.trim()) { onCreate({ name: name.trim(), email }); setName(''); setEmail(''); } }}>Adicionar Aluno</button>
    </div>
  );
}

function ProgressEditor({ progress, onChange }) {
  const [completedLevels, setCompletedLevels] = useState(progress.completedLevels || 0);
  const [currentLevel, setCurrentLevel] = useState(progress.currentLevel || 1);
  const [finalGrade, setFinalGrade] = useState(progress.finalGrade ?? 0);
  const [exercisesCompleted, setExercisesCompleted] = useState(progress.exercisesCompleted ?? 0);
  const [lessonsCompleted, setLessonsCompleted] = useState(progress.lessonsCompleted ?? 0);
  useEffect(() => {
    setCompletedLevels(progress.completedLevels || 0);
    setCurrentLevel(progress.currentLevel || 1);
    setFinalGrade(progress.finalGrade ?? 0);
    setExercisesCompleted(progress.exercisesCompleted ?? 0);
    setLessonsCompleted(progress.lessonsCompleted ?? 0);
  }, [progress]);
  return (
    <div className="editor-grid">
      <div>
        <span className="editor-label">Níveis Completos (0-10)</span>
        <input
          type="number"
          className="input-field"
          value={completedLevels}
          onChange={(e) => setCompletedLevels(parseInt(e.target.value || '0'))}
          min={0}
          max={10}
        />
      </div>
      <div>
        <span className="editor-label">Nível Atual (1-10)</span>
        <input
          type="number"
          className="input-field"
          value={currentLevel}
          onChange={(e) => setCurrentLevel(parseInt(e.target.value || '1'))}
          min={1}
          max={10}
        />
      </div>
      <div>
        <span className="editor-label">Nota Final (0-100)</span>
        <input
          type="number"
          className="input-field"
          value={finalGrade}
          onChange={(e) => setFinalGrade(parseInt(e.target.value || '0'))}
          min={0}
          max={100}
        />
      </div>
      <div>
        <span className="editor-label">Exercícios Completados</span>
        <input
          type="number"
          className="input-field"
          value={exercisesCompleted}
          onChange={(e) => setExercisesCompleted(parseInt(e.target.value || '0'))}
          min={0}
        />
      </div>
      <div>
        <span className="editor-label">Lições Completadas (0-10)</span>
        <input
          type="number"
          className="input-field"
          value={lessonsCompleted}
          onChange={(e) => setLessonsCompleted(parseInt(e.target.value || '0'))}
          min={0}
          max={10}
        />
      </div>
      <div style={{ alignSelf: 'end' }}>
        <button
          className="level-button"
          onClick={() => onChange({ completedLevels, currentLevel, finalGrade, exercisesCompleted, lessonsCompleted })}
        >Salvar</button>
      </div>
    </div>
  );
}

export default Teacher;