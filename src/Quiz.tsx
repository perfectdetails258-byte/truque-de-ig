import { useState, useEffect } from 'react';

interface QuizProps {
  onComplete: () => void;
}

const questions = [
  {
    question: "Você sente que o seu <span class='hl'>tamanho é suficiente</span> ou sabe no fundo que a sua parceira merece sentir mais?",
    options: [
      "Sinto que o meu tamanho podia ser melhor",
      "Tenho medo de não satisfazer como devia",
      "Quero melhorar o meu tamanho e potência"
    ]
  },
  {
    question: "Já sentiu vergonha por achar que o seu <span class='hl'>pau é pequeno</span> demais para deixar a sua parceira realmente satisfeita?",
    options: [
      "Sim, isso já mexeu com a minha confiança",
      "Tenho esse medo, mesmo sem falar",
      "Quero resolver essa insegurança agora"
    ]
  },
  {
    question: "Você acha que a sua parceira fica mesmo satisfeita ou <span class='hl'>apenas finge</span> para não te magoar?",
    options: [
      "Tenho medo que ela esteja a fingir",
      "Às vezes sinto que ela esperava mais",
      "Quero ter certeza que ela fica satisfeita"
    ]
  },
  {
    question: "Se outro homem tivesse <span class='hl'>mais tamanho e potência</span>, você teria medo de perder a sua parceira?",
    options: [
      "Sim, isso me preocupa muito",
      "Tenho medo de ser comparado",
      "Quero ser mais confiante na cama"
    ]
  },
  {
    question: "Está pronto para deixar de se sentir inseguro com o seu tamanho e começar a <span class='hl'>satisfazer a sua parceira</span> com mais confiança?",
    options: [
      "Sim, quero mudar isso agora",
      "Quero descobrir o método hoje"
    ]
  }
];

export default function Quiz({ onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'quiz' | 'loading' | 'done'>('quiz');
  const [animClass, setAnimClass] = useState('');

  const totalQuestions = questions.length;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  // Prevent body scroll while quiz is shown
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOptionClick = () => {
    setAnimClass('fade-out-left');
    setTimeout(() => {
      if (currentIndex + 1 < totalQuestions) {
        setAnimClass('fade-in-right');
        setCurrentIndex(prev => prev + 1);
        setTimeout(() => setAnimClass(''), 20);
      } else {
        setPhase('loading');
        setTimeout(() => {
          setPhase('done');
          setTimeout(() => onComplete(), 1800);
        }, 2500);
      }
    }, 250);
  };

  return (
    <>
      <style>{`
        .quiz-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #f8fafc;
          background-image:
            radial-gradient(circle at 10% 20%, rgba(230,57,70,0.04) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(230,57,70,0.03) 0%, transparent 40%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .quiz-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 10px 40px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02);
          width: 100%;
          max-width: 500px;
          padding: 40px 30px;
          text-align: center;
          overflow: hidden;
          position: relative;
        }

        .quiz-header-bar {
          background: linear-gradient(135deg, #e63946, #c92a37);
          color: #fff;
          padding: 12px 20px;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin: -40px -30px 30px -30px;
          box-shadow: 0 4px 12px rgba(230,57,70,0.18);
        }

        .quiz-progress-wrapper { margin-bottom: 26px; }

        .quiz-progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
        }

        .quiz-question-counter {
          background: #f1f5f9;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 12px;
          color: #0f172a;
        }

        .quiz-bar-track {
          width: 100%;
          height: 8px;
          background: #f1f5f9;
          border-radius: 10px;
          overflow: hidden;
        }

        .quiz-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #e63946, #ff4d5a);
          border-radius: 10px;
          transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
        }

        .quiz-question-box {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .quiz-question-box.fade-out-left {
          opacity: 0;
          transform: translateX(-30px);
        }

        .quiz-question-box.fade-in-right {
          opacity: 0;
          transform: translateX(30px);
        }

        .quiz-question-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.45;
          margin-bottom: 24px;
        }

        .quiz-question-title .hl {
          color: #e63946;
          font-weight: 800;
          position: relative;
          display: inline-block;
        }

        .quiz-question-title .hl::after {
          content: '';
          position: absolute;
          bottom: 1px;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(230,57,70,0.15);
          border-radius: 2px;
        }

        .quiz-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quiz-option-btn {
          background: #fff;
          border: 2px solid #e2e8f0;
          color: #0f172a;
          padding: 16px 20px;
          border-radius: 14px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          text-align: left;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          -webkit-tap-highlight-color: transparent;
        }

        .quiz-option-btn::after {
          content: '➔';
          font-size: 12px;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          color: #e63946;
          flex-shrink: 0;
        }

        .quiz-option-btn:hover {
          border-color: #e63946;
          background: #fff5f5;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(230,57,70,0.08);
        }

        .quiz-option-btn:hover::after {
          opacity: 1;
          transform: translateX(0);
        }

        .quiz-option-btn:active { transform: scale(0.98); }

        /* Loading / Done screen */
        .quiz-loading-screen { padding: 10px 0 5px; }

        .quiz-spinner-wrap {
          position: relative;
          width: 72px;
          height: 72px;
          margin: 0 auto 22px;
        }

        .quiz-spinner-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 4px solid #f1f5f9;
          border-top-color: #e63946;
          animation: quizSpin 1s cubic-bezier(0.5,0,0.5,1) infinite;
        }

        @keyframes quizSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .quiz-success-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 22px;
          border-radius: 50%;
          background: #ecfdf5;
          color: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          font-weight: 700;
          animation: quizPopIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
        }

        @keyframes quizPopIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .quiz-loading-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .quiz-loading-desc {
          color: #64748b;
          font-size: 14px;
          line-height: 1.65;
        }

        @media (max-width: 480px) {
          .quiz-card { padding: 30px 18px; border-radius: 16px; }
          .quiz-header-bar { margin: -30px -18px 24px -18px; }
          .quiz-question-title { font-size: 18px; }
          .quiz-option-btn { font-size: 14px; padding: 14px 15px; }
        }
      `}</style>

      <div className="quiz-overlay">
        <div className="quiz-card">
          <div className="quiz-header-bar">Atenção: Verifique se está apto para este método</div>

          {phase === 'quiz' && (
            <>
              {/* Progress */}
              <div className="quiz-progress-wrapper">
                <div className="quiz-progress-info">
                  <span className="quiz-question-counter">Pergunta {currentIndex + 1} de {totalQuestions}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="quiz-bar-track">
                  <div className="quiz-bar-fill" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>

              {/* Question box */}
              <div className={`quiz-question-box ${animClass}`}>
                <h2
                  className="quiz-question-title"
                  dangerouslySetInnerHTML={{ __html: questions[currentIndex].question }}
                />
                <div className="quiz-options-list">
                  {questions[currentIndex].options.map((opt, i) => (
                    <button key={i} className="quiz-option-btn" onClick={handleOptionClick}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {(phase === 'loading' || phase === 'done') && (
            <div className="quiz-loading-screen">
              {phase === 'loading' ? (
                <div className="quiz-spinner-wrap">
                  <div className="quiz-spinner-ring" />
                </div>
              ) : (
                <div className="quiz-success-icon">✓</div>
              )}
              <h2 className="quiz-loading-title">
                {phase === 'loading' ? 'Estamos a analisar as suas respostas...' : 'Resultado pronto!'}
              </h2>
              <p className="quiz-loading-desc">
                {phase === 'loading'
                  ? 'Por favor, aguarde alguns segundos enquanto validamos o seu perfil.'
                  : 'A redirecionar você para a solução recomendada...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
