import { useState, useEffect, useCallback } from 'react';
import './ProductCarousel.css';

const images = [
  "https://i.postimg.cc/YCNVpZpM/1777348047780-938afe8f-ae6f-4f39-b75d-e86a6465131d.jpg",
  "https://i.postimg.cc/bw0MzWzy/1777348095220-effe1396-06b8-4b8a-883e-fdc4ad9eea68.jpg",
  "https://i.postimg.cc/130T929z/1777348150925-d371dbb9-e5a1-49b0-9d4f-6419392be045.jpg"
];

export function ProductCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const moveSlide = useCallback((direction: number) => {
    setCurrentSlide(prev => {
      let next = prev + direction;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      moveSlide(1);
    }, 3500); // Altera a imagem a cada 3.5 segundos

    return () => clearInterval(timer);
  }, [moveSlide]);

  return (
    <section className="external-image-carousel">
      <div className="carousel-wrapper">
        <button className="carousel-button prev" onClick={() => moveSlide(-1)}>‹</button>

        <div className="carousel-viewport">
          <div 
            className="carousel-track" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((src, index) => (
              <img 
                key={index}
                src={src} 
                alt={`Imagem do produto ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button className="carousel-button next" onClick={() => moveSlide(1)}>›</button>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`} 
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
