import { useRef, useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src as string;
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '200px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsError(true);
  };

  return (
    <div className={`${className} image-container`}>
      <div className={`skeleton ${isLoaded ? 'hide' : ''}`}></div>
      <img
        ref={imgRef}
        className={`image ${isLoaded ? 'loaded' : ''} ${isError ? 'error' : ''}`}
        data-src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default LazyImage;