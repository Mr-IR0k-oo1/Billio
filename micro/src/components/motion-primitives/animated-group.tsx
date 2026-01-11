import { motion, useInView, type HTMLMotionProps, type Variants } from 'framer-motion';
import { type ReactNode, useRef, Children } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGroupProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  className?: string;
  variants?: Variants | { container?: Variants; item?: Variants };
  preset?: 'fade' | 'slide' | 'scale' | 'none';
}

const presets: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
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

  const isNestedVariant = variants && ('container' in variants || 'item' in variants);
  
  const containerVariants = isNestedVariant 
    ? (variants as { container?: Variants }).container 
    : (variants as Variants) || presets[preset];

  const itemVariants = isNestedVariant 
    ? (variants as { item?: Variants }).item 
    : undefined;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn(className)}
      {...props}
    >
      {itemVariants 
        ? Children.map(children, (child) => (
            <motion.div variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children
      }
    </motion.div>
  );
}

export { AnimatedGroup };
