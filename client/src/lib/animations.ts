import { Variants } from "framer-motion";

// Fade in animation variants
export const fadeIn = (delay: number = 0): Variants => ({
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut",
      delay: delay * 0.1
    }
  }
});

// Stagger children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scale animation for hover effects
export const scaleOnHover: Variants = {
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Slide in from the right
export const slideInRight: Variants = {
  hidden: { 
    x: 100,
    opacity: 0
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Slide in from the left
export const slideInLeft: Variants = {
  hidden: { 
    x: -100,
    opacity: 0
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Float animation for images
export const floatAnimation: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Service card hover animation
export const serviceCardAnimation: Variants = {
  initial: { 
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  hover: { 
    y: -10,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    } 
  }
};

// Gallery item zoom animation
export const galleryItemAnimation: Variants = {
  initial: { 
    scale: 1,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.3 }
  }
};

// Stylist card info reveal animation
export const stylistInfoAnimation: Variants = {
  hidden: { 
    y: 100,
    opacity: 0
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Toast notification animation
export const toastAnimation: Variants = {
  hidden: { 
    y: 100,
    opacity: 0
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Mobile menu animation
export const mobileMenuAnimation: Variants = {
  closed: { 
    x: "-100%",
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  open: { 
    x: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
};
