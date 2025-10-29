/**
 * @file animationVariants.js
 * @description Centralized Framer Motion animation variants reused across the UI.
 */

export const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const pageTransitionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const priceUpdateVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.08, 1],
    transition: { duration: 0.4, ease: 'easeInOut' }
  }
};

export const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

export const listItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

export const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.15, ease: 'easeOut' }
  },
  tap: { scale: 0.95 }
};
