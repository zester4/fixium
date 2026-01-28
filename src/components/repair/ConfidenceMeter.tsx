import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  confidence: number; // 0-100
}

export function ConfidenceMeter({ confidence }: ConfidenceMeterProps) {
  const segments = 5;
  const filledSegments = Math.round((confidence / 100) * segments);
  
  const getConfidenceLabel = () => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 75) return 'High';
    if (confidence >= 60) return 'Moderate';
    if (confidence >= 40) return 'Low';
    return 'Uncertain';
  };

  const getConfidenceColor = () => {
    if (confidence >= 75) return 'bg-success';
    if (confidence >= 50) return 'bg-caution';
    return 'bg-warning';
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          Diagnosis Confidence
        </span>
        <span className="font-mono text-sm font-semibold text-foreground">
          {confidence}%
        </span>
      </div>
      
      <div className="flex gap-1 mb-2">
        {Array.from({ length: segments }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`
              confidence-segment flex-1 origin-bottom
              ${index < filledSegments ? getConfidenceColor() : 'bg-muted'}
            `}
          />
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        {getConfidenceLabel()} — Based on {confidence >= 75 ? 'clear' : 'available'} visual data
      </p>
    </div>
  );
}
