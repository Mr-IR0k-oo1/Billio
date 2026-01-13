'use client';

import { motion, type Variants } from 'framer-motion';
import React from 'react';

type PresetType = 'blur' | 'shake' | 'scale' | 'fade' | 'slide' | 'fade-in-blur';

type TextEffectProps = {
  children: string;
  per?: 'word' | 'char' | 'line';
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  speedSegment?: number;
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const presets = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  },
  shake: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 0 },
      visible: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: {
        hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
        visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
    }
  }
};

const AnimationComponent: React.FC<TextEffectProps> = ({
  children,
  per = 'word',
  as = 'div',
  variants,
  className,
  preset,
  delay = 0,
  speedSegment = 0.05,
}) => {
  const Component = motion[as as keyof typeof motion] as any; 

  let segments: string[] = [];

  if (per === 'line') {
    segments = children.split('\n');
  } else if (per === 'word') {
    segments = children.split(/(\s+)/);
  } else {
    segments = children.split('');
  }

  const selectedVariants = preset
    ? presets[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  
  const containerVariants = {
    ...selectedVariants.container,
    visible: {
        ...(selectedVariants.container?.visible as any),
        transition: {
            ...(selectedVariants.container?.visible as any)?.transition,
            staggerChildren: speedSegment,
            delayChildren: delay,
        }
    }
  }

  const itemVariants = variants?.item || selectedVariants.item;

  return (
    <Component
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={`${index}-${segment}`}
          variants={itemVariants}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {segment}
        </motion.span>
      ))}
    </Component>
  );
};

export { AnimationComponent as TextEffect };
