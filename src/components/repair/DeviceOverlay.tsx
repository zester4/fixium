import { motion } from 'framer-motion';
import type { DeviceCategory } from '@/types/repair';

interface DeviceOverlayProps {
  category: DeviceCategory;
  className?: string;
}

export function DeviceOverlay({ category, className = '' }: DeviceOverlayProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-40 ${className}`}
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="0.5"
      strokeDasharray="2 2"
    >
      {category === 'phone' && (
        <motion.rect
          x="25"
          y="10"
          width="50"
          height="80"
          rx="5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
      )}
      {category === 'laptop' && (
        <motion.path
          d="M10 75h80M20 20h60v50H20z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
      )}
      {category === 'tablet' && (
        <motion.rect
          x="15"
          y="15"
          width="70"
          height="70"
          rx="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
      )}
      {/* Target focus area */}
      <circle cx="50" cy="50" r="10" strokeWidth="0.25" />
      <line x1="45" y1="50" x2="55" y2="50" strokeWidth="0.25" />
      <line x1="50" y1="45" x2="50" y2="55" strokeWidth="0.25" />
    </svg>
  );
}
