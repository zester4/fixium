import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Check,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RepairStep } from '@/types/repair';
import { useRepairStore } from '@/store/repairStore';
import { ImageAnnotationOverlay } from './ImageAnnotationOverlay';

interface StepCardProps {
  step: RepairStep;
  index: number;
  isComplete: boolean;
  isExpanded: boolean;
  isCurrent: boolean;
  onToggle: () => void;
  onComplete: () => void;
}

function UserStepPhoto({ stepType }: { stepType: 'front' | 'problem' | 'detail' }) {
  const capturedPhotos = useRepairStore((state) => state.capturedPhotos);
  const photo = capturedPhotos.find((p) => p.type === stepType) || capturedPhotos[0];

  if (!photo) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-mono text-xs tracking-tight">
        No photo available
      </div>
    );
  }

  return (
    <img
      src={photo.dataUrl}
      alt={`User ${stepType} view`}
      className="w-full h-full object-cover"
    />
  );
}

export function StepCard({
  step,
  index,
  isComplete,
  isExpanded,
  isCurrent,
  onToggle,
  onComplete,
}: StepCardProps) {
  const warningStyles = {
    info: {
      bg: 'bg-accent',
      border: 'border-primary/30',
      icon: <Info className="w-4 h-4 text-primary" />,
    },
    caution: {
      bg: 'bg-caution/10',
      border: 'border-caution/30',
      icon: <AlertCircle className="w-4 h-4 text-caution" />,
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      icon: <AlertTriangle className="w-4 h-4 text-warning" />,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`
        rounded-xl border transition-all duration-200
        ${isComplete
          ? 'border-success/30 bg-success/5'
          : isCurrent
            ? 'border-primary/50 bg-card shadow-sm'
            : 'border-border bg-card'
        }
      `}
    >
      {/* Collapsed header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left tap-target"
      >
        {/* Step number badge */}
        <div
          className={`
            step-badge flex-shrink-0 transition-colors
            ${isComplete
              ? 'bg-success text-success-foreground'
              : isCurrent
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }
          `}
        >
          {isComplete ? <Check className="w-4 h-4" /> : step.stepNumber}
        </div>

        {/* Title and meta */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isComplete ? 'text-muted-foreground' : 'text-foreground'}`}>
            {step.title}
          </p>
          {step.estimatedTime && !isExpanded && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {step.estimatedTime}
            </p>
          )}
        </div>

        {/* Warning indicator */}
        {step.warningLevel && !isExpanded && (
          <div className="flex-shrink-0">
            {warningStyles[step.warningLevel].icon}
          </div>
        )}

        {/* Expand icon */}
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-4">
              {/* Divider */}
              <div className="border-t border-border" />

              {/* User Photo with Annotations */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                {/* Fallback to captured photo if available */}
                <UserStepPhoto stepType={step.stepNumber === 1 ? 'front' : 'problem'} />

                {step.imageAnnotations && (
                  <ImageAnnotationOverlay annotations={step.imageAnnotations} />
                )}

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border">
                  <span className="font-mono text-[10px] font-bold tracking-wider">
                    Instructional View
                  </span>
                </div>
              </div>

              {/* Main instruction */}
              <p className="text-foreground leading-relaxed">
                {step.instruction}
              </p>

              {/* Detailed notes */}
              {step.detailedNotes && (
                <p className="text-sm text-muted-foreground italic">
                  {step.detailedNotes}
                </p>
              )}

              {/* Warning message */}
              {step.warningLevel && step.warningMessage && (
                <div
                  className={`
                    flex items-start gap-3 p-3 rounded-lg border
                    ${warningStyles[step.warningLevel].bg}
                    ${warningStyles[step.warningLevel].border}
                  `}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {warningStyles[step.warningLevel].icon}
                  </div>
                  <p className="text-sm text-foreground">
                    {step.warningMessage}
                  </p>
                </div>
              )}

              {/* Tools required */}
              {step.toolsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {step.toolsRequired.map((tool, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      <Wrench className="w-3 h-3 mr-1" />
                      {tool}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta row */}
              <div className="flex items-center justify-between pt-2">
                {step.estimatedTime && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Estimated {step.estimatedTime}
                  </span>
                )}

                {/* Complete button */}
                {!isComplete && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete();
                    }}
                    className="ml-auto"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
