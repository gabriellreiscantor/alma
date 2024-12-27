import { useRef, useEffect } from 'react';

export function useSurveyScroll() {
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToQuestion = (index: number) => {
    setTimeout(() => {
      const element = questionRefs.current[index];
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (window.innerHeight / 2) + (element.clientHeight / 2);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300); // Pequeno delay para melhor experiência
  };

  useEffect(() => {
    scrollToQuestion(0);
  }, []);

  return {
    questionRefs,
    scrollToQuestion
  };
}