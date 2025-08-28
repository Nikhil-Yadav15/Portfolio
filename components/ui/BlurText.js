import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState, useMemo } from 'react';

const buildKeyframes = (from, steps) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  as: Tag = 'p', 
  text = '',
  delay = 200,
  className = '',
  gradientClass = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  // !
  forceStart = false
  // !
}) => {
  const elements = animateBy === 'words' ? (text || '').split(' ') : (text || '').split('');
  const [inView, setInView] = useState(forceStart);
  const [replayTrigger, setReplayTrigger] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (forceStart) {
      setInView(true);
      return; 
    }
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, forceStart]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5,
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

  const AnimatedSegment = ({
    children,
    index,
    inView,
    replayTrigger,
    delay,
    fromSnapshot,
    animateKeyframes,
    totalDuration,
    times,
    easing,
    gradientClass,
    isLast,
    onAnimationComplete,
  }) => {
    const controls = useAnimation();

    const spanTransition = useMemo(
      () => ({
        duration: totalDuration,
        times,
        delay: (index * delay) / 1000,
        ease: easing,
      }),
      [index, delay, totalDuration, times, easing]
    );

    useEffect(() => {
      if (!inView) return;
      if (replayTrigger > 0) {
        controls.set(fromSnapshot);
      }
      controls.start(animateKeyframes, spanTransition);
    }, [
      inView,
      replayTrigger,
      controls,
      fromSnapshot,
      animateKeyframes,
      spanTransition,
    ]);

    return (
      <motion.span
        className={`inline-block will-change-[transform,filter,opacity] ${gradientClass}`}
        initial={fromSnapshot}
        animate={controls}
        onAnimationComplete={isLast ? onAnimationComplete : undefined}
      >
        {children}
      </motion.span>
    );
  };

  return (
    <Tag
      ref={ref}
      className={`blur-text ${className} ${Tag === 'span' ? 'inline-flex' : 'flex'} flex-wrap`}
      onMouseEnter={() => setReplayTrigger((prev) => prev + 1)}
    >
      {elements.map((segment, index) => {
        const content = segment === ' ' ? '\u00A0' : segment;
        const extra =
          animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : '';

        return (
          <AnimatedSegment
            key={index}
            index={index}
            inView={inView}
            replayTrigger={replayTrigger}
            delay={delay}
            fromSnapshot={fromSnapshot}
            animateKeyframes={animateKeyframes}
            totalDuration={totalDuration}
            times={times}
            easing={easing}
            gradientClass={gradientClass}
            isLast={index === elements.length - 1}
            onAnimationComplete={onAnimationComplete}
          >
            {`${content}${extra}`}
          </AnimatedSegment>
        );
      })}
    </Tag>
  );
};

export default BlurText;

