import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 800,
  direction = 'up',
  threshold = 0.08,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety fallback: ensure content is ALWAYS visible after a short timeout in case observer fails (e.g. in iframe previews)
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 600); // 600ms safety net for instant rendering in preview

    // Check if the browser supports IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      clearTimeout(safetyTimer);
      return;
    }

    // Force visible if in an iframe or preview environment to ensure absolute layout reliability
    const isInsideIframe = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };

    if (isInsideIframe()) {
      setIsVisible(true);
      clearTimeout(safetyTimer);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(safetyTimer);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -60px 0px', // Trigger slightly before the section fully enters the viewport
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      clearTimeout(safetyTimer);
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  // Determine starting transform classes based on animation direction
  const getDirectionStyles = () => {
    if (isVisible) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100';
    }

    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-12';
      case 'down':
        return 'opacity-0 -translate-y-12';
      case 'left':
        return 'opacity-0 translate-x-12';
      case 'right':
        return 'opacity-0 -translate-x-12';
      case 'none':
      default:
        return 'opacity-0';
    }
  };

  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ${getDirectionStyles()} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
