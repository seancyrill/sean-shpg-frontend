import { useRef, useEffect, useState, ReactNode } from "react";

type LazyBottomComponentType = {
  children: ReactNode;
};

function LazyBottomComponent({ children }: LazyBottomComponentType) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (isVisible) {
          observer.unobserve(bottomRef.current!);
          return;
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.01, // Intersection ratio when the component should be shown
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [children, isVisible]);

  return (
    <div ref={bottomRef} className="min-h-[300px]">
      {isVisible && children}
    </div>
  );
}

export default LazyBottomComponent;
