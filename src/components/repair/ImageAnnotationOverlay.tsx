import { motion } from 'framer-motion';
import type { ImageAnnotation } from '@/types/repair';

interface ImageAnnotationOverlayProps {
  annotations: ImageAnnotation[];
  className?: string;
}

export function ImageAnnotationOverlay({
  annotations,
  className = '',
}: ImageAnnotationOverlayProps) {
  if (!annotations || annotations.length === 0) return null;

  const colorMap = {
    safe: 'hsl(var(--primary))',
    caution: 'hsl(var(--caution))',
    warning: 'hsl(var(--warning))',
    connector: 'hsl(var(--connector))',
  };

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {annotations.map((annotation) => {
        const color = colorMap[annotation.color];

        if (annotation.type === 'hotspot') {
          return (
            <g key={annotation.id}>
              {/* Outer pulse */}
              <motion.circle
                cx={annotation.x}
                cy={annotation.y}
                r="3"
                fill={color}
                initial={{ opacity: 0.6, scale: 0.8 }}
                animate={{ opacity: 0, scale: 2.5 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              {/* Inner dot */}
              <circle
                cx={annotation.x}
                cy={annotation.y}
                r="1.5"
                fill={color}
                stroke="white"
                strokeWidth="0.5"
              />
              {/* Label background */}
              <rect
                x={annotation.x + 3}
                y={annotation.y - 4}
                width={annotation.label.length * 2.5 + 4}
                height="6"
                rx="1"
                fill="black"
                fillOpacity="0.7"
              />
              {/* Label text */}
              <text
                x={annotation.x + 4}
                y={annotation.y}
                fill="white"
                fontSize="3.5"
                fontWeight="bold"
                className="font-mono"
              >
                {annotation.label}
              </text>
            </g>
          );
        }

        if (annotation.type === 'arrow') {
          // Simple arrow implementation
          return (
            <g key={annotation.id}>
              <defs>
                <marker
                  id={`arrowhead-${annotation.id}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="0"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                </marker>
              </defs>
              <line
                x1={annotation.x - 5}
                y1={annotation.y}
                x2={annotation.x}
                y2={annotation.y}
                stroke={color}
                strokeWidth="1.5"
                markerEnd={`url(#arrowhead-${annotation.id})`}
              />
            </g>
          );
        }

        if (annotation.type === 'zone') {
          return (
            <rect
              key={annotation.id}
              x={annotation.x - 5}
              y={annotation.y - 5}
              width="10"
              height="10"
              fill={color}
              fillOpacity="0.2"
              stroke={color}
              strokeWidth="0.5"
              strokeDasharray="2 1"
            />
          );
        }

        return null;
      })}
    </svg>
  );
}
