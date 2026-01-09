import { motion, useInView, type HTMLMotionProps, type Variants } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGroupProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  preset?: 'fade' | 'slide' | 'scale' | 'none';
}

const presets: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  },
  none: {}
};

export default function AnimatedGroup({
  children,
  className,
  variants,
  preset = 'slide',
  ...props
}: AnimatedGroupProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const selectedVariants = variants || presets[preset];

  // If no variants provided and preset is none, we just render children normally wrapped in motion.div
  // allowing external control or just as a layout wrapper
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { AnimatedGroup };
