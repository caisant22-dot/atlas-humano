import {useState,useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {ChevronRight,X,Trophy,Target,Crosshair,Flame,RotateCcw} from 'lucide-react';
import {SYSTEMS,type Atlas,type SystemId} from './anatomy';
import {generateQuestions,type QuizState,type QuizMode,type Difficulty,type QuizAction} from './quiz-engine';

interface Props {
  atlas: Atlas;
  quiz: QuizState;
  dispatch: (a: QuizAction) => void;
  onClose: () => void;
}

export default function QuizPanel({atlas, quiz, dispatch, onClose}: Props) {
  // ─── Setup screen ───
  if (!quiz.active && quiz.answered === 0) return <SetupScreen atlas={atlas} dispatch={dispatch} onClose={onClose} />;

  // ─── Results screen ───
  if (!quiz.active && quiz.answered > 0) return <ResultsScreen quiz={quiz} dispatch={dispatch} atlas={atlas} onClose={onClose} />;

  // ─── Active quiz ───
  const q = quiz.questions[quiz.current];
  const progress = ((quiz.current + (quiz.feedback ? 1 : 0)) / quiz.questions.length) * 100;

  return (
    <div className="quiz-panel glass">
      <div className="panel-heading">
        <span>Pratique</span>
        <div className="quiz-stats">
          {quiz.streak >= 2 && <Badge variant="secondary" className="quiz-streak"><Flame size={12}/>{quiz.streak}</Badge>}
          <Badge variant="secondary">{quiz.score}/{quiz.answered}</Badge>
        </div>
        <Button variant="ghost" className="icon-button" onClick={() => dispatch({type:'quit'})} aria-label="Sair do quiz"><X size={18}/></Button>
      </div>

      <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{width:`${progress}%`}}/></div>

      <div className="quiz-question-area">
        <div className="quiz-question-number">Questão {quiz.current + 1} de {quiz.questions.length}</div>

        {quiz.mode === 'identify' ? (
          <>
            <p className="quiz-prompt">Qual é a estrutura destacada?</p>
            <div className="quiz-options">
              {q.options.map(opt => {
                const isCorrect = opt.toLowerCase() === q.concept.name.toLowerCase();
                const isSelected = quiz.userAnswer === opt;
                let cls = 'quiz-option';
                if (quiz.feedback) {
                  if (isCorrect) cls += ' correct';
                  else if (isSelected) cls += ' wrong';
                  else cls += ' dimmed';
                }
                return (
                  <Button
                    key={opt}
                    variant="ghost"
                    className={cls}
                    disabled={!!quiz.feedback}
                    onClick={() => dispatch({type:'answer', answer: opt, conceptId: ''})}
                  >
                    {opt}
                  </Button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <p className="quiz-prompt">Encontre e toque na estrutura:</p>
            <div className="quiz-locate-target">
              <Target size={20}/>
              <strong>{q.concept.name}</strong>
            </div>
            {quiz.feedback && (
              <div className={`quiz-feedback ${quiz.feedback}`}>
                {quiz.feedback === 'correct' ? 'Correto!' : `Incorreto — era: ${q.concept.name}`}
              </div>
            )}
          </>
        )}

        {quiz.feedback && (
          <Button className="quiz-next" onClick={() => dispatch({type:'next'})}>
            {quiz.current + 1 < quiz.questions.length ? 'Próxima' : 'Ver resultado'}
            <ChevronRight size={16}/>
          </Button>
        )}
      </div>
    </div>
  );
}

function SetupScreen({atlas, dispatch, onClose}: {atlas: Atlas; dispatch: (a: QuizAction) => void; onClose: () => void}) {
  const [mode, setMode] = useState<QuizMode>('identify');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [systemFilter, setSystemFilter] = useState<SystemId | 'all'>('all');

  const start = useCallback(() => {
    const questions = generateQuestions(atlas, mode, difficulty, systemFilter, 10);
    if (questions.length === 0) return;
    dispatch({type:'start', mode, difficulty, systemFilter, questions});
  }, [atlas, mode, difficulty, systemFilter, dispatch]);

  const activeSystems = SYSTEMS.filter(s => atlas.parts.some(p => p.system === s.id));

  return (
    <div className="quiz-panel glass">
      <div className="panel-heading">
        <span>Pratique</span>
        <Button variant="ghost" className="icon-button" onClick={onClose} aria-label="Fechar quiz"><X size={18}/></Button>
      </div>

      <div className="quiz-setup">
        <div className="quiz-field">
          <label>Modo</label>
          <div className="quiz-toggle-group">
            <Button variant={mode==='identify'?'default':'ghost'} className="quiz-toggle" onClick={()=>setMode('identify')}>
              <Crosshair size={16}/>Identificar
            </Button>
            <Button variant={mode==='locate'?'default':'ghost'} className="quiz-toggle" onClick={()=>setMode('locate')}>
              <Target size={16}/>Localizar
            </Button>
          </div>
        </div>

        <div className="quiz-field">
          <label>Dificuldade</label>
          <div className="quiz-toggle-group">
            {(['beginner','intermediate','advanced'] as Difficulty[]).map(d => (
              <Button key={d} variant={difficulty===d?'default':'ghost'} className="quiz-toggle" onClick={()=>setDifficulty(d)}>
                {d==='beginner'?'Iniciante':d==='intermediate'?'Intermediário':'Avançado'}
              </Button>
            ))}
          </div>
        </div>

        <div className="quiz-field">
          <label>Sistema</label>
          <div className="quiz-system-list">
            <Button variant={systemFilter==='all'?'default':'ghost'} className="quiz-toggle" onClick={()=>setSystemFilter('all')}>
              Todos
            </Button>
            {activeSystems.map(s => (
              <Button key={s.id} variant={systemFilter===s.id?'default':'ghost'} className="quiz-toggle" onClick={()=>setSystemFilter(s.id)}>
                <span className="system-dot" style={{background:s.color}}/>{s.name}
              </Button>
            ))}
          </div>
        </div>

        <Button className="quiz-start" onClick={start}>
          Iniciar quiz
          <ChevronRight size={16}/>
        </Button>
      </div>
    </div>
  );
}

function ResultsScreen({quiz, dispatch, atlas, onClose}: {quiz: QuizState; dispatch: (a: QuizAction) => void; atlas: Atlas; onClose: () => void}) {
  const pct = Math.round((quiz.score / quiz.answered) * 100);

  const retry = useCallback(() => {
    const questions = generateQuestions(atlas, quiz.mode, quiz.difficulty, quiz.systemFilter, 10);
    dispatch({type:'start', mode: quiz.mode, difficulty: quiz.difficulty, systemFilter: quiz.systemFilter, questions});
  }, [atlas, quiz, dispatch]);

  return (
    <div className="quiz-panel glass">
      <div className="panel-heading">
        <span>Resultado</span>
        <Button variant="ghost" className="icon-button" onClick={onClose} aria-label="Fechar"><X size={18}/></Button>
      </div>

      <div className="quiz-results">
        <div className="quiz-results-score">
          <Trophy size={32}/>
          <div className="quiz-results-big">{pct}%</div>
          <div className="quiz-results-detail">{quiz.score} de {quiz.answered} corretas</div>
        </div>

        {quiz.bestStreak >= 2 && (
          <div className="quiz-results-streak">
            <Flame size={16}/> Melhor sequência: {quiz.bestStreak}
          </div>
        )}

        <div className="quiz-results-actions">
          <Button className="quiz-start" onClick={retry}>
            <RotateCcw size={16}/>Jogar novamente
          </Button>
          <Button variant="ghost" onClick={() => {dispatch({type:'quit'}); onClose();}}>
            Voltar ao atlas
          </Button>
        </div>
      </div>
    </div>
  );
}
