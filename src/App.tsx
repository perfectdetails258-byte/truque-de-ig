import { useEffect, useState } from 'react';

function App() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [likes, setLikes] = useState({
    1: 142, 2: 98, 3: 213, 4: 167, 5: 189
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observeTargets = document.querySelectorAll('.fb-comment, .video-wrapper, .cta-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observeTargets.forEach((el) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(24px)';
      (el as HTMLElement).style.transition = 'opacity .55s ease, transform .55s ease';
      observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    return () => observer.disconnect();
  }, []);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  const handleLike = (id: number) => {
    setLikes(prev => ({ ...prev, [id]: prev[id as keyof typeof prev] + 1 }));
  };

  return (
    <>
      {/* ══════════════════ URGENCY BAR ══════════════════ */}
      <div className="urgency-bar" id="urgency-bar">
        <p className="urgency-label">ATENÇÃO: ESTA OFERTA ÚNICA EXPIRA EM</p>
        <div className="urgency-clock">
          <span>{m}</span><span className="urgency-colon">:</span><span>{s}</span>
        </div>
      </div>

      {/* ══════════════════ HERO ══════════════════ */}
      <header className="hero" id="hero">
        <div className="container">
          <div className="headline-wrap">
            {/* Seta esquerda */}
            <svg className="arrow arrow-left" viewBox="0 0 70 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M55 8 C38 28, 18 52, 28 85 C34 102, 46 112, 42 124" stroke="#D71920" strokeWidth={3.5} strokeLinecap="round" fill="none" />
              <path d="M34 114 L42 126 L52 118" stroke="#D71920" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>

            <h1 className="hero-title" id="hero-title">
              DURE MAIS DE&nbsp;<span className="hl-box">40 MINUTOS</span>&nbsp;NA&nbsp;<span className="hl-circle">CAMA</span>&nbsp;COM ESTA
              <br />
              <span className="hl-red">TÉCNICA</span>&nbsp;<span className="hl-ellipse">SECRETA</span>&nbsp;E FAZ QUALQUER MULHER
              <br />
              TREMER, GRITAR E&nbsp;<span className="hl-box">IMPLORAR</span>&nbsp;POR MAIS!
            </h1>

            {/* Seta direita */}
            <svg className="arrow arrow-right" viewBox="0 0 70 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M15 8 C32 28, 52 52, 42 85 C36 102, 24 112, 28 124" stroke="#D71920" strokeWidth={3.5} strokeLinecap="round" fill="none" />
              <path d="M36 114 L28 126 L18 118" stroke="#D71920" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>
      </header>

      {/* ══════════════════ VIDEO ══════════════════ */}
      <section className="video-section" id="video">
        <div className="container">
          <div className="video-wrapper" id="video-wrapper">
            {/* VSL ConverteAI */}
            <div id="ifr_6a0b2acc6515da7a84396c29_wrapper" style={{ margin: '0 auto', width: '100%', maxWidth: '400px' }}>
              <div style={{ position: 'relative', padding: '133.33333333333331% 0 0 0' }} id="ifr_6a0b2acc6515da7a84396c29_aspect">
                <iframe
                  frameBorder="0"
                  allowFullScreen
                  src={`https://scripts.converteai.net/ab7070c5-d15e-48ca-bbc4-15b523de4355/players/6a0b2acc6515da7a84396c29/v4/embed.html?vl=${encodeURIComponent(window.location.href)}`}
                  id="ifr_6a0b2acc6515da7a84396c29"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  referrerPolicy="origin"
                ></iframe>
              </div>
            </div>
          </div>
          <p className="video-caption">⚠️ Atenção: Este vídeo pode ser removido a qualquer momento.</p>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="testimonials-section" id="depoimentos">
        <div className="container container--narrow">
          <div className="fb-comments-wrapper">
            <div className="fb-comments-header">
              <span className="fb-comments-count">1.249 comentários</span>
              <span className="fb-comments-sort">Ordenar por mais recentes</span>
            </div>

            {/* Comment 1 */}
            <div className="fb-comment">
              <img src="/avatar_fernando.png" alt="Perfil" className="fb-avatar" />
              <div className="fb-comment-body">
                <div className="fb-comment-bubble">
                  <span className="fb-name">Fernando Matsinhe</span>
                  <span className="fb-text">Isso realmente funciona! No início fiquei na dúvida, mas depois de testar esse truque do pau de cavalo, minha vida na cama mudou totalmente. Minha esposa agora nem acredita kkkkkk. Valeu muito a pena!</span>
                </div>
                <div className="fb-comment-actions">
                  <span className="fb-action" onClick={() => handleLike(1)} style={{ cursor: 'pointer' }}>Gostar {likes[1] > 142 && `(${likes[1]})`}</span>
                  <span className="fb-action">Responder</span>
                  <span className="fb-time">há 4 min</span>
                </div>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="fb-comment">
              <img src="/avatar2.png" alt="Perfil" className="fb-avatar" />
              <div className="fb-comment-body">
                <div className="fb-comment-bubble">
                  <span className="fb-name">Palatos Cossa</span>
                  <span className="fb-text">O conteúdo é incrível e apliquei hoje mesmo. Meu Deus, que diferença! Estava quase a desistir de procurar solução. Valeu cada cêntimo o investimento, podem comprar sem medo malta!</span>
                </div>
                <div className="fb-comment-actions">
                  <span className="fb-action" onClick={() => handleLike(2)} style={{ cursor: 'pointer' }}>Gostar {likes[2] > 98 && `(${likes[2]})`}</span>
                  <span className="fb-action">Responder</span>
                  <span className="fb-time">há 8 min</span>
                </div>
              </div>
            </div>

            {/* Comment 3 */}
            <div className="fb-comment">
              <img src="/avatar_alberto.png" alt="Perfil" className="fb-avatar" />
              <div className="fb-comment-body">
                <div className="fb-comment-bubble">
                  <span className="fb-name">Alberto Cossa</span>
                  <span className="fb-text">Obrigado por partilharem esse conteúdo. Estava a passar por momentos difíceis no meu casamento por causa da rapidez. Agora aguento mais de 30 minutos tranquilo. Mudou tudo aqui em casa.</span>
                </div>
                <div className="fb-comment-actions">
                  <span className="fb-action" onClick={() => handleLike(3)} style={{ cursor: 'pointer' }}>Gostar {likes[3] > 213 && `(${likes[3]})`}</span>
                  <span className="fb-action">Responder</span>
                  <span className="fb-time">há 12 min</span>
                </div>
              </div>
            </div>

            {/* Comment 4 */}
            <div className="fb-comment">
              <img src="/avatar2.png" alt="Perfil" className="fb-avatar" />
              <div className="fb-comment-body">
                <div className="fb-comment-bubble">
                  <span className="fb-name">Ricardo Mabunda</span>
                  <span className="fb-text">Simplesmente fenomenal. Resultados rápidos e naturais. Sinto-me com a energia de um jovem de 20 anos. Podem confiar bradas, o truque é real!</span>
                </div>
                <div className="fb-comment-actions">
                  <span className="fb-action" onClick={() => handleLike(4)} style={{ cursor: 'pointer' }}>Gostar {likes[4] > 167 && `(${likes[4]})`}</span>
                  <span className="fb-action">Responder</span>
                  <span className="fb-time">há 26 min</span>
                </div>
              </div>
            </div>

            {/* Comment 5 */}
            <div className="fb-comment">
              <img src="/avatar1.png" alt="Perfil" className="fb-avatar" />
              <div className="fb-comment-body">
                <div className="fb-comment-bubble">
                  <span className="fb-name">Samuel Tembe</span>
                  <span className="fb-text">Eu já tinha tentado de tudo, até comprimidos que faziam mal ao coração. Esse método é a única coisa que funcionou de verdade e sem efeitos secundários. Recomendo 100%.</span>
                </div>
                <div className="fb-comment-actions">
                  <span className="fb-action" onClick={() => handleLike(5)} style={{ cursor: 'pointer' }}>Gostar {likes[5] > 189 && `(${likes[5]})`}</span>
                  <span className="fb-action">Responder</span>
                  <span className="fb-time">há 1 hora</span>
                </div>
              </div>
            </div>

            <div className="fb-comments-load">
              <a href="#video">Carregar mais 10 comentários...</a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default App;
