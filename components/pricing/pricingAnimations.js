// components/pricing/pricingAnimations.js

export const cardVariants = {
  hidden: { y: 100, opacity: 0, rotateY: 45 },
  visible: {
    y: 0,
    opacity: 1,
    rotateY: 0,
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 1 },
  },
  hover: {
    y: -20,
    scale: 1.03,
    rotateY: 5,
    boxShadow: "0 25px 50px -12px rgba(255, 154, 0, 0.25)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

export const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, boxShadow: "0 10px 25px rgba(255, 154, 0, 0.5)" },
  tap: { scale: 0.95 },
};