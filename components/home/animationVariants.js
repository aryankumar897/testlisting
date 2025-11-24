export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: '0 12px 25px rgba(255, 83, 26, 0.6)'
  },
  tap: { scale: 0.95 }
};

export const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 1 }
  }
};

export const formContainerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.5, duration: 0.7 }
  }
};

export const transparentBoxVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { delay: 0.7, duration: 0.5 }
  }
};

export const floatingElementAnimations = {
  first: {
    animate: {
      y: [0, -20, 0],
      scale: [1, 1.1, 1],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  second: {
    animate: {
      y: [0, 20, 0],
      scale: [1.1, 1, 1.1],
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1
    }
  },
  third: {
    animate: {
      y: [0, -30, 0],
      scale: [0.8, 1, 0.8],
    },
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }
  }
};